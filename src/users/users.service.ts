import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './user.interface';
import { Response } from 'express';
import aqp from 'api-query-params';
import { Role, RoleDocument } from '@/roles/schemas/role.schema';
import { USER_ROLE } from '@/databases/sample';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>
  ) { }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }


  async create(req: CreateUserDto) {
    const newUser = await this.userModel.findOne({ email: req.email })
    if (newUser) {
      throw new BadRequestException(`Email: ${req.email} đã tồn tại trên hệ thống`)
    }
    const hashPassword = this.getHashPassword(req.password);
    let user = await this.userModel.create({
      name: req.name,
      email: req.email,
      password: hashPassword,
      age: req.age,
      gender: req.gender,
      role: req.role,
      address: req.address,
      company: {
        _id: req.company._id,
        name: req.company.name
      }

    })
    return user;
  }

  async findAll(query: any, curentPage: string, limit: string) {
    let total = (await this.userModel.find({})).length
    let { filter } = aqp(query)
    delete filter.current
    delete filter.pageSize
    let offset = (+curentPage - 1) * (+limit);
    let result = await this.userModel.find(filter).limit(+limit).skip(offset).sort(query.sort).select("-password");
    return {
      meta: {
        current: +curentPage,
        pageSize: result.length,
        pages: Math.ceil(total / (+limit)),
        total: total
      },
      result: result
    }
  }


  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`;
    let result = await this.userModel.findOne({
      _id: id,
    }
    ).select("-password").populate([
      {path:'role',select:{name:1, description:1,permissions:1}}
    
    ])
    return result
  }

  async findOneByUsername(username: string) {
    return await this.userModel.findOne({
      email: username
    }).populate( {path:'role',select:{name:1}})
  }


  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, {
      ...updateUserDto, updatedBy: {
        _id: user._id,
        email: user.email
      }
    })
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Không tìm thấy ai cả`)
    }
    const foudUser = await this.userModel.findById({ _id: id })
    if (foudUser.role === "ADMIN") { throw new BadRequestException(`Không thể xóa người dùng role là ${foudUser.role}`) }


    return await this.userModel.updateOne({
      _id: id,
      isDeleted: true,
      deletedBy: user
    })
  }

  async register(user: RegisterUserDto) {
    const hashPassword = this.getHashPassword(user.password)
    const newUser = await this.userModel.findOne({ email: user.email })
    if (newUser) {
      throw new BadRequestException(`Email: ${user.email} đã tồn tại trên hệ thống`)
    }
    const userRole = await this.roleModel.findOne({name:USER_ROLE})
    const result = await this.userModel.create({
      name: user.name,
      email: user.email,
      password: hashPassword,
      age: user.age,
      gender: user.gender,
      address: user.address,
      role:userRole?._id
    })
    return {
      _id: result?._id,
      createdAt: result?.createdAt
    }
  }
  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, {
      refreshToken
    }
    )
  }

  findUserByRefreshToken = async (refreshToken: string) => {
    const user = await this.userModel.findOne({ refreshToken })
    console.log(user)
    return (await this.userModel.findOne({ refreshToken })).populate({path:"role",select:{name:1}})
  }

  logout = async (user: IUser, response: Response) => {
    await this.userModel.updateOne({ _id: user._id }, { refreshToken: null })
    response.clearCookie("refresh_token")
    return 'ok'
  }
}

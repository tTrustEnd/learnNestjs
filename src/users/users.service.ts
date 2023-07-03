import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {genSaltSync,hashSync} from 'bcryptjs'
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  getHashPassword = (password : string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  async create(User:CreateUserDto) {
    const hashPassword = this.getHashPassword(User.password)
    let user = await this.userModel.create({
      email:User.email, password:hashPassword, name:User.name
    })
    return user;  
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id))
    return 'not found user';

    return this.userModel.findOne({_id:id})
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({_id:updateUserDto._id},{...updateUserDto});
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

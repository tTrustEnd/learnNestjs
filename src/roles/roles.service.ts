import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from '@/users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import { IsObject } from 'class-validator';
import aqp from 'api-query-params';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>) { }

  async create(createroleDto: CreateRoleDto, user: IUser) {
    const data = await this.roleModel.findOne({name:createroleDto.name})
    if(data){
      throw new BadGatewayException('name không được trùng')
    }
    const result = await this.roleModel.create({
      ...createroleDto, createdBy: {
        _id: user._id,
        email: user.email
      }
    });
    return {
      _id: result._id,
      createdAt: result.createdAt
    }
  }

 async findAll(query:any,currentPage:string,limit:string) {
    let total = (await this.roleModel.find({})).length
    let { filter,population,projection } = aqp(query)
    delete filter.current
    delete filter.pageSize

    let offset = (+currentPage - 1) * (+limit)
    let result = await this.roleModel.find(filter).limit(+limit).skip(offset).sort(query.sort).populate(population).select(projection as any);
    return {
      meta: {
        current: +currentPage,
        pageSize: result.length,
        pages: Math.ceil(total / (+limit)),
        total: total
      },
      result: result
    }
  }

 async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id))
    throw new BadGatewayException("not found role")
    
    return (await this.roleModel.findById({_id:id})).populate({
    path: "permissions",
    select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 }
    });
  }

 async update(id: string, updateroleDto: UpdateRoleDto, user:IUser) {
    if(!mongoose.Types.ObjectId.isValid(id))
    throw new BadGatewayException("not found role")
    return await this.roleModel.updateOne({_id:id},{...updateroleDto,updatedBy:{
      _id:user._id,
      email:user.email
    }});
  }

 async remove(id: string,user:IUser) {
    if(!mongoose.Types.ObjectId.isValid(id))
    throw new BadGatewayException("not found role")

    const foudUser = await this.roleModel.findById({_id:id})
    if (foudUser.name === "ADMIN")
     { throw new BadRequestException(`Không thể xóa role ${foudUser.name}`)}
    await this.roleModel.updateOne({_id:id},{deletedBy:{
      _id:user._id,
      email:user.email
    }})
    return await this.roleModel.softDelete({_id:id});
  }
}

import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from '@/users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import { IsObject } from 'class-validator';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>) { }

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const data = await this.permissionModel.findOne({ apiPath: createPermissionDto.apiPath, method: createPermissionDto.method })
    if (data) {
      throw new BadGatewayException("đã tồn tại Permission")
    }
    const result = await this.permissionModel.create({
      ...createPermissionDto, createdBy: {
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
    let total = (await this.permissionModel.find({})).length
    let { filter,population,projection } = aqp(query)
    delete filter.current
    delete filter.pageSize

    let offset = (+currentPage - 1) * (+limit)
    let result = await this.permissionModel.find(filter).limit(+limit).skip(offset).sort(query.sort).populate(population).select(projection as any);
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
    throw new BadGatewayException("not found permission")
    return await this.permissionModel.findOne({_id:id});
  }

 async update(id: string, updatePermissionDto: UpdatePermissionDto, user:IUser) {
    if(!mongoose.Types.ObjectId.isValid(id))
    throw new BadGatewayException("not found permission")
    return await this.permissionModel.updateOne({_id:id},{...updatePermissionDto,updatedBy:{
      _id:user._id,
      email:user.email
    }});
  }

 async remove(id: string,user:IUser) {
    if(!mongoose.Types.ObjectId.isValid(id))
    throw new BadGatewayException("not found permission")
    await this.permissionModel.updateOne({_id:id},{deletedBy:{
      _id:user._id,
      email:user.email
    }})
    return await this.permissionModel.softDelete({_id:id});
  }
}

import { Injectable, Delete, BadRequestException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from '@/users/user.interface';
import { query } from 'express';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>
  ) { }

 async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return await this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
  }
 async findAll(query:any,currentPage:string,limit:string) {
  console.log(query)
    let total = (await this.companyModel.find({})).length
    let { filter} = aqp(query)
    delete filter.current
    delete filter.pageSize

    let offset = (+currentPage - 1) * (+limit)
    let result = await this.companyModel.find(filter).limit(+limit).skip(offset).sort(query.sort);
    return {
      meta: {
        current: +currentPage,
        pageSize:result.length,
        pages:Math.ceil(total/(+limit)),
        total:total
      },
      result:result
    }
  }

  findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id))
    throw new BadRequestException('not found company')
    return this.companyModel.findOne({_id:id});
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return await this.companyModel.updateOne({ _id: id }, {
      ...updateCompanyDto, updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async remove(id: string, user: IUser) {
    await this.companyModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    return await this.companyModel.softDelete({ _id: id });
  }
}

// import { Injectable } from '@nestjs/common';
// import { CreateResumeDto } from './dto/create-resume.dto';
// import { UpdateResumeDto } from './dto/update-resume.dto';
// import { Resume, ResumeDocument } from './schemas/resume.schema';
// import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
// import { InjectModel } from '@nestjs/mongoose';

// @Injectable()
// export class ResumesService {
//   constructor(@InjectModel(Resume.name)
//   private resumeModel: SoftDeleteModel<ResumeDocument>) { }

//   create(createResumeDto: CreateResumeDto) {
//     return 'This action adds a new resume';
//   }

//   findAll() {
//     return `This action returns all resumes`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} resume`;
//   }

//   update(id: number, updateResumeDto: UpdateResumeDto) {
//     return `This action updates a #${id} resume`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} resume`;
//   }
// }
import { Injectable, Delete, BadRequestException } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from '@/users/user.interface';
import { query } from 'express';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>
  ) { }

  async create(createresumeDto: CreateResumeDto, user: IUser) {
    const newResume = await this.resumeModel.create({
      ...createresumeDto,
      email: user.email,
      userId: user._id,
      history: {
        status: createresumeDto.status,
        updatedAt: new Date,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      },
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
    return {
      _id: newResume._id,
      createdAt: newResume.createdAt
    }
  }

  async findAll(query: any, currentPage: string, limit: string) {
    console.log(query)
    let total = (await this.resumeModel.find({})).length
    let { filter,population,projection } = aqp(query)
    delete filter.current
    delete filter.pageSize

    let offset = (+currentPage - 1) * (+limit)
    let result = await this.resumeModel.find(filter).limit(+limit).skip(offset).sort(query.sort).populate(population).select(projection as any);
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
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException('not found resume')
    return await this.resumeModel.findOne({ _id: id });
  }

  async update(id: string, updateresumeDto: UpdateResumeDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException('not found resume')
    return await this.resumeModel.updateOne({ _id: id }, {
      status: updateresumeDto.status,
      updatedBy: {
        _id: user._id,
        email: user.email
      },
      $push:{
        history:{
          status: updateresumeDto.status,
          updatedAt: new Date,
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        }
      }
    
    });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException('not found resume')
    await this.resumeModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    return await this.resumeModel.softDelete({ _id: id });
  }
  getCVbyUser = async (user: IUser) => {
    return this.resumeModel.find({ createdBy: { _id: user._id, email: user.email } })
  }
}

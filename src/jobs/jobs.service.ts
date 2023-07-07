import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from '@/users/user.interface';
import { Job, JobDocument, JobSchema } from './schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private JobModel: SoftDeleteModel<JobDocument>) { }

  async create(createJobDto: CreateJobDto, user: IUser) {
    const newJob = await this.JobModel.create({
      ...createJobDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    }
    );
    return {
      _id: newJob?._id,
      createAt: newJob?.createdAt
    }

  }

 async findAll(currentPage:string,limit:string,query:any) {
    let total = (await this.JobModel.find({})).length
    let {filter} = aqp(query)
    delete filter.current
    delete filter.pageSize
    let offset = (+currentPage- 1) * (+limit);
    let result = await this.JobModel.find(filter).limit(+limit).skip(offset).sort(query.sort)
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
    return 'not found job'
    return await this.JobModel.findOne({_id:id});
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(id))
    return 'not found job'
    return await this.JobModel.updateOne({ _id: id }, {
      ...updateJobDto, updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async remove(id: string, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(id))
    return 'not found job'
    return await this.JobModel.updateOne({ _id: id }, {
      isDeleted: true, deletedBy: {
        _id: user._id,
        email: user.email,
      }
    });
  }
}

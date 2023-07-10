import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { IUser } from '@/users/user.interface';
import { Subscriber, SubscriberDocument,  } from './schemas/Subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>
  ) { }

  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {

    const newSubscriber = await this.subscriberModel.create({
      ...createSubscriberDto,
      email: user.email
    }
    );
    return {
      _id: newSubscriber?._id,
      createAt: newSubscriber?.createdAt
    }

  }

  async findAll(currentPage: string, limit: string, query: any) {
    let total = (await this.subscriberModel.find({})).length
    let { filter } = aqp(query)
    delete filter.current
    delete filter.pageSize
    let offset = (+currentPage - 1) * (+limit);
    let result = await this.subscriberModel.find(filter).limit(+limit).skip(offset).sort(query.sort)
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
      return 'not found Subscriber'
    return await this.subscriberModel.findOne({ _id: id });
  }

  async update(id: string, updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'not found Subscriber'
    return await this.subscriberModel.updateOne({ _id: id }, {
      ...updateSubscriberDto, updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'not found Subscriber'
    await this.subscriberModel.updateOne({ _id: id }, {
      isDeleted: true, deletedBy: {
        _id: user._id,
        email: user.email,
      }
    });
    return await this.subscriberModel.softDelete({ _id: id })
  }
}

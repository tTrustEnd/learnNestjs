import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Render } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { IUser } from '@/users/user.interface';
import { Public, RESPONSEMESSAGE, User } from 'decorator/customize';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  @RESPONSEMESSAGE("create a new Subscriber")
  create(@Body() createSubscriberDto: CreateSubscriberDto, @User() user:IUser) {
    return this.subscribersService.create(createSubscriberDto,user);
  }

  @Get()
  @Public()
  @RESPONSEMESSAGE("get Subscriber with paginate")
  findAll(
    @Query() query: any,
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string
    )  {
    return this.subscribersService.findAll(currentPage,limit,query);
  }

  @Get(':id')
  @RESPONSEMESSAGE("get a Subscriber by id")
  @Public()
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }

  @Patch(':id')
  @RESPONSEMESSAGE("update a Subscriber")
  update(@Param('id') id: string, @Body() updateSubscriberDto: UpdateSubscriberDto, @User() user:IUser) {
    return this.subscribersService.update(id, updateSubscriberDto,user);
  }

  @Delete(':id')
  @RESPONSEMESSAGE("delete a Subscriber")
  remove(@Param('id') id: string, @User() user:IUser) {
    return this.subscribersService.remove(id,user);
  }
}

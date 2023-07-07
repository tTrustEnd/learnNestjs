import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '@/stateless/passport/stateless.jwt.auth.guard';
import { IUser } from '@/users/user.interface';
import { Public, RESPONSEMESSAGE, User } from 'decorator/customize';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @RESPONSEMESSAGE("create a new job")
  create(@Body() createJobDto: CreateJobDto, @User() user:IUser) {
    return this.jobsService.create(createJobDto,user);
  }

  @Get()
  @RESPONSEMESSAGE("get job with paginate")
  findAll(
    @Query() query: any,
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string
    )  {
    return this.jobsService.findAll(currentPage,limit,query);
  }

  @Get(':id')
  @RESPONSEMESSAGE("get a job by id")
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @RESPONSEMESSAGE("update a job")
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @User() user:IUser) {
    return this.jobsService.update(id, updateJobDto,user);
  }

  @Delete(':id')
  @RESPONSEMESSAGE("delete a job")
  remove(@Param('id') id: string, @User() user:IUser) {
    return this.jobsService.remove(id,user);
  }
}

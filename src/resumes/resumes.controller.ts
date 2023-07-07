
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Request, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Public, RESPONSEMESSAGE, User } from 'decorator/customize';
import { IUser } from '@/users/user.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly ResumesService: ResumesService) { }

  @Post()
  @RESPONSEMESSAGE("Created a resume")
  create(@Body() createresumeDto: CreateResumeDto, @User() user: IUser) {
    return this.ResumesService.create(createresumeDto, user);
  }

  @Get()
  @RESPONSEMESSAGE("fetch resume with paginate")
  findAll(
    @Query() query: string,
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string
    ) {
    return this.ResumesService.findAll(query,currentPage,limit);
  }

  @Get(':id')
  @RESPONSEMESSAGE("fetch resume by id")
  findOne(@Param('id') id: string) {
    return this.ResumesService.findOne(id);
  }

  @Patch(':id')
  @RESPONSEMESSAGE("update resume by id")
  update(@Param('id') id: string, @Body() updateresumeDto: UpdateResumeDto, @User() user: IUser) {
    return this.ResumesService.update(id, updateresumeDto, user);
  }

  @Delete(':id')
  @RESPONSEMESSAGE("delete resume")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.ResumesService.remove(id, user);
  }

  @Post('/by-user')
  @RESPONSEMESSAGE("get resume by user")
  getCVbyUser(@User() user: IUser) {
    return this.ResumesService.getCVbyUser(user);
  }
}

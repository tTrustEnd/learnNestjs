import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@/stateless/passport/stateless.jwt.auth.guard';
import { Public, RESPONSEMESSAGE, User } from 'decorator/customize';
import { IUser } from './user.interface';

@Controller('users') // => /users
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Public()
  @Post()
  @RESPONSEMESSAGE("create a user")
  create(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @Get()
  @RESPONSEMESSAGE("get user with paginate")
  findAll(
    @Query() query: string,
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string
    ) {
    return this.usersService.findAll(query,currentPage,limit);
  }

  @RESPONSEMESSAGE("get user by id")
  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @RESPONSEMESSAGE("update a user")
  update(@Body() updateUserDto: UpdateUserDto, @User() user:IUser) {
    console.log(updateUserDto)
    return this.usersService.update(updateUserDto,user);
  }
  @RESPONSEMESSAGE("delete a user")
  @Delete(':id')
  remove(@Param('id') id: string, @User() user:IUser) {
    return this.usersService.remove(id,user);
  }
}

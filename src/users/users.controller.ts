import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@/stateless/passport/stateless.jwt.auth.guard';

@Controller('users') // => /users
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() hoidanit: CreateUserDto) {
    return this.usersService.create(hoidanit);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Get(':id')
  findOne(
    @Param('id')
    id: string
  ) {

    return this.usersService.findOne(id);
  }



  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

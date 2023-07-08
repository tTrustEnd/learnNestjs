import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from '@/users/user.interface';
import { RESPONSEMESSAGE, User } from 'decorator/customize';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RESPONSEMESSAGE("create a role")
  create(@Body() createroleDto: CreateRoleDto, @User() user:IUser) {
    return this.rolesService.create(createroleDto,user);
  }

  @Get()
  @RESPONSEMESSAGE("fetch role with paginate")
  findAll(
    @Query() query: string,
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string
    ) {
    return this.rolesService.findAll(query,currentPage,limit);
  }


  @Get(':id')
  @RESPONSEMESSAGE("fetch role by id")
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @RESPONSEMESSAGE("update a role")
  update(@Param('id') id: string, @Body() updateroleDto: UpdateRoleDto, @User() user:IUser) {
    return this.rolesService.update(id, updateroleDto, user);
  }

  @Delete(':id')
  @RESPONSEMESSAGE("delete a role")
  remove(@Param('id') id: string, @User() user:IUser) {
    return this.rolesService.remove(id,user);
  }
}

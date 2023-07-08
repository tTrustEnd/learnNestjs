import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from '@/users/user.interface';
import { RESPONSEMESSAGE, User } from 'decorator/customize';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @RESPONSEMESSAGE("create a Permission")
  create(@Body() createPermissionDto: CreatePermissionDto, @User() user:IUser) {
    return this.permissionsService.create(createPermissionDto,user);
  }

  @Get()
  @RESPONSEMESSAGE("fetch permission with paginate")
  findAll(
    @Query() query: string,
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string
    ) {
    return this.permissionsService.findAll(query,currentPage,limit);
  }


  @Get(':id')
  @RESPONSEMESSAGE("fetch permission by id")
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @RESPONSEMESSAGE("update a Permission")
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @User() user:IUser) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @Delete(':id')
  @RESPONSEMESSAGE("delete a Permission")
  remove(@Param('id') id: string, @User() user:IUser) {
    return this.permissionsService.remove(id,user);
  }
}

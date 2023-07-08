import { Permission, PermissionDocument } from '@/permissions/schemas/permission.schema';
import { Role, RoleDocument } from '@/roles/schemas/role.schema';
import { User, UserDocument } from '@/users/schemas/user.schema';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './sample';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name)

  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,

    private ConfigService: ConfigService,
    private usersService: UsersService,
  ) { }

  async onModuleInit() {
    const SHOULD_INIT = this.ConfigService.get<string>('SHOULD_INIT')
    if (SHOULD_INIT) {
      const countUser = await this.userModel.count({})
      const countRole = await this.roleModel.count({})
      const countPermission = await this.permissionModel.count({})
      if (countPermission === 0) {
        const permission = await this.permissionModel.insertMany(INIT_PERMISSIONS)
      }
      if (countRole === 0) {
        const permission = await this.permissionModel.find({}).select('_id')
        const role = await this.roleModel.insertMany([{
          name: ADMIN_ROLE,
          description: "Admin thì full quyền",
          isActive: true,
          permissions: permission
        },
        {
          name: USER_ROLE,
          description: "Người dùng/ Ứng viên sử dụng hệ thống",
          isActive: true,
          permissions: []
        }]
        )
      }
      if (countUser === 0) {
        const adminRole = await this.roleModel.findOne({ name: ADMIN_ROLE })
        const userRole = await this.roleModel.findOne({ name: USER_ROLE })

        await this.userModel.insertMany([
          {
            name: "Trường",
            email: 'admin@gmail.com',
            password: this.usersService.getHashPassword(this.ConfigService.get<string>('INIT_PASSWORD')),
            age: 23,
            gender: 'MALE',
            address: "VN",
            role: adminRole?._id
          },
          {
            name: "Trường user",
            email: 'user@gmail.com',
            password: this.usersService.getHashPassword(this.ConfigService.get<string>('INIT_PASSWORD')),
            age: 23,
            gender: 'MALE',
            address: "VN",
            role: userRole?._id
          }
        ]

        )

        if( countUser >0 && countPermission>0 && countRole>0){
          this.logger.log('>>> ALREADY INIT SAMPLE DATA...')
        }
      }


    }
  }


}

import { Company } from '@/companies/schemas/company.schema';
import { Job } from '@/jobs/schemas/job.schema';
import { Permission } from '@/permissions/schemas/permission.schema';
import { User } from '@/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    isActive: boolean;

    // @Prop({type:mongoose.Schema.Types.Array, ref:Permission.name})
    // permissions:{
    //   _id:mongoose.Schema.Types.ObjectId
    // }[]
    // Hoặc khai báo như này để database hiển thị chữ ObjectId
    @Prop({type:[mongoose.Schema.Types.ObjectId], ref:Permission.name})
    permissions:Permission[]

    @Prop()
    updatedAt: Date;

    @Prop()
    createdAt: Date;

    @Prop()
    isDeleted: Boolean

    @Prop()
    deletedAt: Date

    @Prop({type:Object})
    createdBy: {
        _id: string,
        email: string
    };
    @Prop({type:Object})
    deletedBy: {
        _id: string,
        email: string
    };
    @Prop({type:Object})
    updatedBy: {
        _id: string,
        email: string
    };
}

export const RoleSchema = SchemaFactory.createForClass(Role);

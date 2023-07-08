
import { Company } from '@/companies/schemas/company.schema';
import { Job } from '@/jobs/schemas/job.schema';
import { User } from '@/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({ timestamps: true })
export class Permission {
    @Prop()
    name: string;

    @Prop({ ref:User.name})
    apiPath: string;

    @Prop()
    method: string;

    @Prop()
    module: string;

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

export const PermissionSchema = SchemaFactory.createForClass(Permission);

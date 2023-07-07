import { Company } from '@/companies/schemas/company.schema';
import { Job } from '@/jobs/schemas/job.schema';
import { User } from '@/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ timestamps: true })
export class Resume {
    @Prop()
    email: string;

    @Prop({ ref:User.name})
    userId: mongoose.Schema.Types.ObjectId;

    @Prop()
    url: string;

    @Prop()
    status: string;

    @Prop({ref:Company.name})
    companyId:mongoose.Schema.Types.ObjectId;

    @Prop({ ref:Job.name})
    jobId:mongoose.Schema.Types.ObjectId;

    @Prop({type:mongoose.Schema.Types.Array})
    history:{
        status:string,
        updatedAt: Date,
        updatedBy:{
            _id:string,
            email:string
        }
    }[]

    @Prop()
    updatedAt: Date;

    @Prop()
    createdAt: Date;

    @Prop()
    isDeleted: Boolean

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

export const ResumeSchema = SchemaFactory.createForClass(Resume);

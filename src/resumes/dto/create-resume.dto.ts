import { IsEmail, IsMongoId, IsNotEmpty, isNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

//data transfer object // class = { }
export class CreateResumeDto {
    email: string;

    userId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'url không được để trống', })
    url: string;

    @IsNotEmpty({ message: 'status không được để trống', })
    status: string;

    @IsNotEmpty({ message: 'companyId không được để trống', })
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'jobId không được để trống', })
    jobId: mongoose.Schema.Types.ObjectId;
}
export class CreateUserCVDto {

    @IsNotEmpty({ message: 'url không được để trống', })
    url: string;

    @IsNotEmpty({ message: 'companyId không được để trống', })
    @IsMongoId({ message: 'companyId không được để trống', })
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'jobId không được để trống', })
    @IsMongoId({ message: 'companyId không được để trống', })
    jobId: mongoose.Schema.Types.ObjectId;
}
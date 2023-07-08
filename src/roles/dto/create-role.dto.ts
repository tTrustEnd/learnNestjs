
import { IsArray, IsEmail, IsMongoId, IsNotEmpty, isNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

//data transfer object // class = { }
export class CreateRoleDto {
    @IsNotEmpty({ message: 'name không được để trống', })
    name: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'description không được để trống', })
    description: string;

    @IsNotEmpty({ message: 'isActive không được để trống', })
    isActive: boolean;

    @IsNotEmpty({ message: 'permissions không được để trống', })
    @IsArray()
    @IsMongoId({each:true, message: 'permissions là MongoId', })
    permissions: mongoose.Schema.Types.ObjectId[]
}
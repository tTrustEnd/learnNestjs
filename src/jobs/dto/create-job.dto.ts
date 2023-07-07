import { ArrayNotEmpty, IsArray, IsDate, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested, isDate } from 'class-validator';
import { Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Transform, Type } from 'class-transformer';

//data transfer object // class = { }
class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId

    @IsNotEmpty({message:"Tên company không được để trống"})
    name: string
}
class Skills {
    
}

export class CreateJobDto {
    @IsNotEmpty({ message: 'Name không được để trống', })
    name: string;

    @IsArray({message:"Skill phải là Array"})
    @IsString({ each: true,message:"Skill phải là string" })
    @ArrayNotEmpty({message:"Skill không được để trống"})  
    skills: string[];

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

    @IsNotEmpty({ message: 'location không được để trống', })
    location: string;

    @IsNotEmpty({ message: 'Salary không được để trống', })
    salary: string;

    @IsNotEmpty({ message: 'Logo không được để trống', })
    Logo: string;

    @IsNotEmpty({ message: 'quantity không được để trống', })
    quantity: string;

    @IsNotEmpty({ message: 'Level không được để trống', })
    level: string;

    @IsNotEmpty({ message: 'Description không được để trống', })
    description: string;

    @IsNotEmpty({ message: 'StartDate không được để trống', })
    @Transform(({value}) => new Date(value))
    @IsDate({message:'startDate có định dạng là Date'})
    startDate: Date;

    @IsNotEmpty({ message: 'EndDate không được để trống', })    
    @Transform(({value}) => new Date(value))
    @IsDate({message:'endDate có định dạng là Date'})
    endDate: Date;

    @IsNotEmpty({ message: 'IsActive không được để trống', })
    isActive: boolean;

}

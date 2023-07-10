import { ArrayNotEmpty, IsArray, IsDate, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested, isDate, isEmail } from 'class-validator';

//data transfer object // class = { }

export class CreateSubscriberDto {
    // @IsEmail({},{message:"email phải có định dạng @gmail.com"})
    // @IsNotEmpty({ message: 'email không được để trống', })
    // email: string;

    // @IsNotEmpty({ message: 'Name không được để trống', })
    // name: string;
    
    @IsArray({message:"Skill phải là Array"})
    @IsString({ each: true,message:"Skill phải là string" })
    @ArrayNotEmpty({message:"Skill không được để trống"})  
    skills: string[];
}

import { IsEmail, IsNotEmpty } from 'class-validator';

//data transfer object // class = { }
export class CreateCompanyDto {
    @IsNotEmpty({ message: 'Name không được để trống', })
    email: string;

    @IsNotEmpty({ message: 'Address không được để trống', })
    address: string;

    @IsNotEmpty({ message: 'Description không được để trống', })
    description: string;
}
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '@/users/user.interface';
import { RegisterUserDto } from '@/users/dto/create-user.dto';
import { UsersModule } from '@/users/users.module';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UserDocument } from '@/users/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';
import { async } from 'rxjs';
@Injectable()
export class StatelessService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private ConfigService: ConfigService
    ) { }

    async validateUserStateless(username: string, pass: string): Promise<any> {

        const user = await this.usersService.findOneByUsername(username);
        if (!user) {
            return null;
        }
        const isValidPassword = this.usersService.isValidPassword(pass, user.password);
        if (!isValidPassword) {
            throw new UnauthorizedException();
        }
        return user;
    }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };
        response.clearCookie('refresh_token')
        const refresh_token = this.createRefreshToken(payload)
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.ConfigService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')) * 1000
        })
        //cần setup http only ở postman = true để chỉ server lấy được thôi chứ không cho client dùng javascrip để lấy
        await this.usersService.updateUserToken(refresh_token, _id)
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role
            }
        };
    }


    async register(user: RegisterUserDto) {
        return this.usersService.register(user);

    }

    
    createRefreshToken = (payload: any) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.ConfigService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: ms(this.ConfigService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')) / 1000
        })
        return refresh_token
    }

    processRefreshToken = async (refreshToken: string,response:Response) => {
        console.log(refreshToken)
        try {
          this.jwtService.verify(refreshToken, {
                secret: this.ConfigService.get<string>('JWT_REFRESH_TOKEN_SECRET')
            })
           let user = await this.usersService.findUserByRefreshToken(refreshToken)
           if(user){
            const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };
        response.clearCookie('refresh_token')
        const refresh_token = this.createRefreshToken(payload)
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.ConfigService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')) * 1000
        })
        //cần setup http only ở postman = true để chỉ server lấy được thôi chứ không cho client dùng javascrip để lấy
        await this.usersService.updateUserToken(refresh_token, _id.toString())
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role
            }
        };
           }else{
            throw new BadRequestException("Token hết hạn hoặc không hợp lệ, vui lòng login")
           }

        } catch (error) {
            throw new BadRequestException("Token hết hạn hoặc không hợp lệ vui lòng login")
        }
    }

    logout = (user:IUser,response:Response) =>{
        return this.usersService.logout(user,response)
    }
}
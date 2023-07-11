import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './passport/stateless.local.guard';
import { StatelessService } from './stateless.service';
import { JwtAuthGuard } from './passport/stateless.jwt.auth.guard';
import { Public, RESPONSEMESSAGE, User } from 'decorator/customize';
import { RegisterUserDto } from '@/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from '@/users/user.interface';
import { RolesService } from './../roles/roles.service';
import {ThrottlerGuard,Throttle} from '@nestjs/throttler'
@Controller('auth')
export class StatelessController {
    constructor(
        private statelessService: StatelessService,
        private rolesService: RolesService
        ) { }
    @Public()
    @UseGuards(LocalAuthGuard)
    @RESPONSEMESSAGE('Login')
    @UseGuards(ThrottlerGuard)
    @Throttle(1,60)// ghi đè thằng trên là 2,60
    @Post('login')
    async login(@Req() req,@Res({ passthrough: true }) response: Response) {
        return this.statelessService.login(req.user,response);
    }

    @RESPONSEMESSAGE("get user info")
    @Get('account')
   async getProfile(@User() user:IUser) {
        const temp = await this.rolesService.findOne(user.role._id) as any;
        user.permissions=temp.permissions.toObject()
        return {user};
    }

    @RESPONSEMESSAGE("get user info")
    @Public()
    @Get('refresh')
    getRefreshToken(@Req() request:Request, @Res({ passthrough: true }) response: Response) {
    
        return this.statelessService.processRefreshToken(request.cookies["refresh_token"],response)
    }

    @Public()
    @Post('register')
    async register(@Body() user:RegisterUserDto) {
        return this.statelessService.register(user);
    }
    @RESPONSEMESSAGE("Logout User")
    @Post('logout')
    logout(@User() user:IUser, @Res({ passthrough: true }) response: Response) {
    
        return this.statelessService.logout(user,response)
    }

}

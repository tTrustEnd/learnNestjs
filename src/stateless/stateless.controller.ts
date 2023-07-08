import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './passport/stateless.local.guard';
import { StatelessService } from './stateless.service';
import { JwtAuthGuard } from './passport/stateless.jwt.auth.guard';
import { Public, RESPONSEMESSAGE, User } from 'decorator/customize';
import { RegisterUserDto } from '@/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from '@/users/user.interface';
import { RolesService } from './../roles/roles.service';
@Controller('auth')
export class StatelessController {
    constructor(
        private statelessService: StatelessService,
        private rolesService: RolesService
        ) { }
    @UseGuards(LocalAuthGuard)
    @Public()
    @RESPONSEMESSAGE('Login')
    @Post('login')
    async login(@Req() req,@Res({ passthrough: true }) response: Response) {
        console.log(req)
        return this.statelessService.login(req.user,response);
    }

    @UseGuards(JwtAuthGuard)
    @RESPONSEMESSAGE("get user info")
    @Get('account')
   async getProfile(@User() user:IUser) {
        const temp = await this.rolesService.findOne(user.role._id) as any;
        user.permissions=temp.permissions
        return {user};
    }

    @UseGuards(JwtAuthGuard)
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
    @UseGuards(JwtAuthGuard)
    @RESPONSEMESSAGE("Logout User")
    @Post('logout')
    logout(@User() user:IUser, @Res({ passthrough: true }) response: Response) {
    
        return this.statelessService.logout(user,response)
    }

}

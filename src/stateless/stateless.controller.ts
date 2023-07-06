import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './passport/stateless.local.guard';
import { StatelessService } from './stateless.service';
import { JwtAuthGuard } from './passport/stateless.jwt.auth.guard';
import { Public, RESPONSEMESSAGE, User } from 'decorator/customize';
import { RegisterUserDto } from '@/users/dto/create-user.dto';
import { Request, Response, response } from 'express';
import { IUser } from '@/users/user.interface';
@Controller('stateless')
export class StatelessController {
    constructor(private statelessService: StatelessService,) { }
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
    getProfile(@User() user:IUser) {
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
}

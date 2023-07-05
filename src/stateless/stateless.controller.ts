import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './passport/stateless.local.guard';
import { StatelessService } from './stateless.service';
import { JwtAuthGuard } from './passport/stateless.jwt.auth.guard';
import { Public } from 'decorator/customize';

@Controller('stateless')
export class StatelessController {
    constructor(private statelessService: StatelessService) { }
    @UseGuards(LocalAuthGuard)
    @Public()
    @Post('login')
    async login(@Request() req) {
        return this.statelessService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('user')
    getProfile(@Request() req) {
        delete req.user.password;
        return req.user;
    }
}

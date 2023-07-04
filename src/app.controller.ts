import { Controller, Get, Post, Put, Delete, Render,UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller() //  route /
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService

  ) { }
  @Get()
  // @Render('home')
  handleHomePage() {
    const message1 = this.appService.getHello();
    return {
      message: message1
    }
  }


  @Get("abc")
  getHello1(): string {
    return this.appService.getHello();
  }
}

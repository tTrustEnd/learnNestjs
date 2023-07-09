import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, RESPONSEMESSAGE } from 'decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService,
    private mailerService: MailerService
  ) { }

  @Get()
  @Public()
  @RESPONSEMESSAGE("Test email")
  async handleTestEmail() {
    await this.mailerService.sendMail({
      to: "truong.nq185728@gmail.com",
      from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template:'new-job'
    });
  }
}

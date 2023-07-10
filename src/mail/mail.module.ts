import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Job, JobSchema } from '@/jobs/schemas/job.schema';
import { Subscriber, SubscriberSchema } from '@/subscribers/schemas/subscriber.schema';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get<string>('SENDER_EMAIL'),
            pass: configService.get<string>('PASSWORD_EMAIL'),
          },
        },
        template: {
          dir: join(__dirname, '..', '.././mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        preview: configService.get<string>('PREVIEW_EMAIL') === 'true' ? true : false
      }),
      inject: [ConfigService],
    }), 
    MongooseModule.forFeature([{ name: Subscriber.name, schema: SubscriberSchema},
      { name: Job.name, schema:JobSchema }
    ])
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule { }
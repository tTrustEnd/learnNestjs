import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, RESPONSEMESSAGE } from 'decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from '@/subscribers/schemas/Subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from '@/jobs/schemas/job.schema';
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService,
    private mailerService: MailerService,
    @InjectModel(Subscriber.name) private subscriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name) private JobModel: SoftDeleteModel<JobDocument>
  ) { }

  @Get()
  @Public()
  @RESPONSEMESSAGE("Test email")

  async handleTestEmail() {

    const Subscriber = await this.subscriberModel.find({})
    for (const SubscriberSkills of Subscriber) {
      const jobSkills = SubscriberSkills.skills
      const jobs = await this.JobModel.find({ skills: { $in: jobSkills } })
      if (jobs && jobs.length) {
        const jobss = jobs.map(item => {
          return {
            name: item.name,
            company: item.company.name,
            salary: item.salary,
            skills: item.skills
          }
        }
 
        )
        await this.mailerService.sendMail({
          to: "truong.nq185728@gmail.com",
          from: '"Support Team" <support@example.com>', // override default from
          subject: 'Welcome to Nice App! Confirm your Email',
          template: 'new-job',
          context: { 
            name: "Trường Nguyễn", 
            jobs: jobss
          }
        })
      }

    }

    ;
  }
}

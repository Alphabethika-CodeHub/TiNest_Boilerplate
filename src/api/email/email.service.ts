import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailOptions, Attachment } from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) { }

  public send(input: {
    to: string;
    subject: string;
    body: string;
    attachments?: Attachment[];
    cc?: string[];
  }): void {
    const { to, subject, body, attachments, cc } = input;

    const mailerBody: SendMailOptions = {
      to,
      from: process.env.SMTP_FROM,
      subject,
      html: body,
      attachments,
      cc,
    };

    this.mailerService
      .sendMail(mailerBody)
      .then((res) => {
        console.log('Email Success');
      })
      .catch((err) => {
        console.log(err, 'Email Error');
      });
  }
}

import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailTransport {
  private readonly logger = new Logger(EmailTransport.name);

  private transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'rogelio.hilll@ethereal.email',
        pass: '9ZCgmwu925Dgwq32c8'
    }
  });

  async sendEmail(input: {
    to: string;
    subject: string;
    html: string;
  }) {
    try {
      const result = await this.transporter.sendMail({
        from: `"GitHub Integration" <no-reply@system.local>`,
        to: input.to,
        subject: input.subject,
        html: input.html,
      });

      this.logger.log(
        `Email sent: ${result.messageId}`,
      );

      return result;
    } catch (error) {
      this.logger.error('Email send failed', error);
      throw error;
    }
  }
}
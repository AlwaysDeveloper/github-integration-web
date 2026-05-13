import { Injectable, Logger } from '@nestjs/common';
import { NotificationEntity } from '../database/entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTransport } from './email.transport';
import { UserService } from '../user/user.service';
import { NotificationEmailTemplate } from './notification-email.template';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
    private readonly emailTransport: EmailTransport,
    private readonly userService: UserService,
  ) {}

  async sendNotification(input: Partial<NotificationEntity>) {
    this.logger.log(`Sending notification to user=${input.userId}`);

    const notificationEntity = this.notificationRepo.create(input);

    const savedNotification =
      await this.notificationRepo.save(notificationEntity);

    this.logger.log(`Notification stored for user=${input.userId}`);

    const user = await this.userService.getUserById(input.userId);

    if ((input.type || ['']).includes('email')) {
      await this.sendEmail({
        notification: savedNotification,
        userEmail: user?.email,
      });
    }

    if ((input.type || ['']).includes('push')) {
      await this.sendPush({
        notification: savedNotification,
      });
    }
  }

  private async sendEmail(input: {
    notification: NotificationEntity;
    userEmail?: string;
  }) {
    const emailObject = NotificationEmailTemplate.build(input.notification);

    this.logger.log(
      `Email sent to user=${input.notification.userId} subject=${emailObject.subject}`,
    );

    await this.emailTransport.sendEmail({
      to: input.userEmail || '',
      subject: emailObject.subject,
      html: emailObject.html,
    });
  }

  private async sendPush(input: { notification: NotificationEntity }) {
    this.logger.log(
      `Push sent to user=${input.notification.userId} about ${input.notification.title}`,
    );
  }
}

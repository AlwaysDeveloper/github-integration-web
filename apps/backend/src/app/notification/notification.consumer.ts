import { Injectable, Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { RabbitConsumer } from '@github-web-integration/rabbitmq';
import { NotificationEntity } from '../database/entities/notification.entity';

@Injectable()
export class NotificationConsumer {
  private readonly logger = new Logger(NotificationConsumer.name);

  constructor(private readonly notificationService: NotificationService) {}

  @RabbitConsumer({
    exchange: 'notification.events',
    routingKey: 'notification.send',
    queue: 'notification-send-queue',
  })
  async handleNotificationEvent(payload: any) {
    try {
      this.logger.log('Notification event received');
      
      if (!payload?.body?.data) {
        this.logger.warn('No event data found in notification payload');
        return;
      }

      await this.notificationService.sendNotification(this.toEntity(payload, payload.userId));

      this.logger.log(`Notification processed for user=${payload.userId}`);
    } catch (error) {
      this.logger.error('Failed to process notification', error);
    }
  }

  toEntity(input: any, userId: string): Partial<NotificationEntity> {
    const data = input?.body?.data;

    if (!data) {
      throw new Error('Invalid notification payload');
    }

    return {
      userId,

      type: input?.types?.includes('email') ? 'email' : 'push',

      title: this.buildTitle(input?.body?.about, data),

      message: this.buildMessage(data),

      metadata: this.buildMetadata(data),
    };
  }

  private buildTitle(about: string, data: any): string {
    switch (about) {
      case 'PULL_REQUEST':
        return `PR #${data.pullRequestNumber} ${data.action}`;
      default:
        return about || 'Notification';
    }
  }

  private buildMessage(data: any): string {
    return [
      `Repository: ${data.githubRepositoryId}`,
      `Title: ${data.title}`,
      `Author: ${data.authorUsername}`,
      `State: ${data.state}`,
      data.htmlUrl ? `Link: ${data.htmlUrl}` : null,
    ]
      .filter(Boolean)
      .join('\n');
  }

  private buildMetadata(data: any): Record<string, any> {
    return {
      githubRepositoryId: data.githubRepositoryId,
      githubPullRequestId: data.githubPullRequestId,
      pullRequestNumber: data.pullRequestNumber,
      action: data.action,
      state: data.state,
      merged: data.merged,
      htmlUrl: data.htmlUrl,
      baseBranch: data.baseBranch,
      headBranch: data.headBranch,
    };
  }
}

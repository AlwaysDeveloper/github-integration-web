import { Injectable } from '@nestjs/common';
import { GithubService } from '../github/github.service';
import { User } from '@github-web-integration/http-client';
import { InjectRepository } from '@nestjs/typeorm';
import { WebhookEntity } from '../database/entities/webhooks.entity';
import { Repository } from 'typeorm';
import { Repository as RepoModel } from '../repositories/repository.model';
import { RabbitMQService } from '@github-web-integration/rabbitmq';

export interface GithubWebhookResponse {
  id: number;
  active: boolean;
  events: string[];

  config: {
    url: string;
    content_type: string;
    secret?: string;
  };

  created_at: string;
  updated_at: string;
}

@Injectable()
export class WebhooksService {
  constructor(
    private readonly githubService: GithubService,
    @InjectRepository(WebhookEntity)
    private readonly webhook: Repository<WebhookEntity>,
    private readonly rabbitmq: RabbitMQService,
  ) {}

  async checkWebhookAndCreate(repo: RepoModel, user: User) {
    const webhook = await this.webhook.findOne({
      where: {
        repositoryId: repo.id,
      },
    });

    if (!webhook) {
      return this.createWebHook(repo, user, ['pull_request']);
    }

    return webhook;
  }

  async createWebHook(repo: RepoModel, user: User, evnets: string[]) {
    const response = (await this.githubService.registerWebhook(
      repo.owner,
      repo.repoName,
      user.token,
      `${process.env.PUBLIC_BASE_URL}/api/webhooks/github`,
      evnets,
    )) as GithubWebhookResponse;

    return this.webhook.save({
      githubWebhookId: response.id.toString(),
      webhookUrl: response.config.url,
      isActive: response.active,
      events: response.events,
      repositoryId: repo.id,
    });
  }

  async handleWebhookRequest(payload: any) {
    await this.rabbitmq.publish({
      exchange: 'github.events',
      routingKey: `pull_request.${payload.action}`,
      message: {
        payload,
        metaData: {
          receivedAt: new Date(),
        },
      },
    });
    return;
  }
}

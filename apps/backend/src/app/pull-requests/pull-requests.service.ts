import {
  RabbitConsumer,
  RabbitMQService,
} from '@github-web-integration/rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PullRequestEntity } from '../database/entities/pull-request.entity';
import { Repository } from 'typeorm';
import { PullRequestMapper } from './pull-request.mapper';
import { RepositoryEntity } from '../database/entities/repository.entity';

@Injectable()
export class PullRequestsService {
  private logger: Logger = new Logger(PullRequestsService.name);

  constructor(
    private readonly rabbitmq: RabbitMQService,
    @InjectRepository(PullRequestEntity)
    private readonly pullRequest: Repository<PullRequestEntity>,
    @InjectRepository(RepositoryEntity)
    private readonly repositoryRepo: Repository<RepositoryEntity>,
  ) {}

  @RabbitConsumer({
    exchange: 'github.events',
    routingKey: 'pull_request.*',
    queue: 'pull-request-events-queue',
  })
  async onPullRequestCreated(payload: Record<string, any>) {
    try {
      const mappedPayload = PullRequestMapper.toEntity(payload);

      const repository = await this.repositoryRepo.findOne({
        where: { githubRepoId: mappedPayload.githubRepositoryId },
      });

      if (!repository?.isSubscribed) {
        this.logger.warn(
          `For Repository: ${repository?.repoName} is not subscribed by user: ${repository?.userId}`,
        );
        return;
      }

      await this.pullRequest.upsert(mappedPayload, {
        conflictPaths: ['githubPullRequestId'],
      });

      const savedPr = await this.pullRequest.findOne({
        where: {
          githubRepositoryId: payload.payload.repository.id,
        },
        relations: {
          repository: true,
        },
      });

      if (!savedPr || !savedPr.repository) {
        this.logger.warn(
          `Repository not found for PR ${mappedPayload.githubPullRequestId}`,
        );
        return;
      }

      const userId = savedPr.repository.userId;

      this.rabbitmq.publish({
        exchange: 'notification.events',
        routingKey: 'notification.send',
        message: {
          userId,
          types: ['email', 'push'],
          body: {
            about: 'PULL_REQUEST',
            data: mappedPayload,
          },
        },
      });

      this.logger.log(`PR synced + notification sent for userId=${userId}`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}

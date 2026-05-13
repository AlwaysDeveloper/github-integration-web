import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PullRequestsService } from './pull-requests.service';
import { RabbitMQService } from '@github-web-integration/rabbitmq';
import { PullRequestEntity } from '../database/entities/pull-request.entity';
import { RepositoryEntity } from '../database/entities/repository.entity';

describe('PullRequestsService', () => {
  let service: PullRequestsService;
  const rabbitmqService = {
    publish: jest.fn(),
  };
  const pullRequestRepo = {
    upsert: jest.fn(),
    findOne: jest.fn(),
  };
  const repositoryRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PullRequestsService,
        { provide: RabbitMQService, useValue: rabbitmqService },
        { provide: getRepositoryToken(PullRequestEntity), useValue: pullRequestRepo },
        { provide: getRepositoryToken(RepositoryEntity), useValue: repositoryRepo },
      ],
    }).compile();

    service = module.get<PullRequestsService>(PullRequestsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not publish notification if repository is not subscribed', async () => {
    repositoryRepo.findOne.mockResolvedValue({ isSubscribed: false, repoName: 'repo1', userId: 'user-id' });

    await service.onPullRequestCreated({
      payload: {
        pull_request: { id: 10 },
        repository: { id: 1 },
        action: 'opened',
        sender: { login: 'sender' },
      },
    });

    expect(pullRequestRepo.upsert).not.toHaveBeenCalled();
    expect(rabbitmqService.publish).not.toHaveBeenCalled();
  });

  it('should upsert PR and publish notification when subscribed repo exists', async () => {
    repositoryRepo.findOne.mockResolvedValue({ isSubscribed: true, repoName: 'repo1', userId: 'user-id' });
    pullRequestRepo.findOne.mockResolvedValue({
      githubRepositoryId: '1',
      repository: { userId: 'user-id' },
    });

    await service.onPullRequestCreated({
      payload: {
        action: 'opened',
        pull_request: {
          id: 10,
          number: 1,
          state: 'open',
          merged: false,
          title: 'PR title',
          body: 'body',
          html_url: 'url',
          diff_url: 'diff',
          patch_url: 'patch',
          head: { ref: 'feature', sha: 'sha123' },
          base: { ref: 'main' },
          commits: 1,
          additions: 1,
          deletions: 0,
          changed_files: 1,
          comments: 0,
          review_comments: 0,
          user: { login: 'author', avatar_url: 'avatar', html_url: 'profile' },
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        repository: { id: 1 },
        sender: { login: 'sender' },
      },
    });

    expect(pullRequestRepo.upsert).toHaveBeenCalled();
    expect(pullRequestRepo.findOne).toHaveBeenCalledWith({
      where: { githubRepositoryId: 1 },
      relations: { repository: true },
    });
    expect(rabbitmqService.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        exchange: 'notification.events',
        routingKey: 'notification.send',
        message: expect.objectContaining({
          userId: 'user-id',
          body: expect.objectContaining({ about: 'PULL_REQUEST' }),
        }),
      }),
    );
  });

  it('should log and not publish if saved PR has no repository', async () => {
    repositoryRepo.findOne.mockResolvedValue({ isSubscribed: true, repoName: 'repo1', userId: 'user-id' });
    pullRequestRepo.findOne.mockResolvedValue({ githubRepositoryId: '1', repository: null });

    await service.onPullRequestCreated({
      payload: {
        action: 'opened',
        pull_request: { id: 10, number: 1, state: 'open', merged: false, title: 'PR', body: '', html_url: '', diff_url: '', patch_url: '', head: { ref: 'feature', sha: 'sha' }, base: { ref: 'main' }, commits: 0, additions: 0, deletions: 0, changed_files: 0, comments: 0, review_comments: 0, user: { login: 'author', avatar_url: '', html_url: '' }, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
        repository: { id: 1 },
        sender: { login: 'sender' },
      },
    });

    expect(rabbitmqService.publish).not.toHaveBeenCalled();
  });
});

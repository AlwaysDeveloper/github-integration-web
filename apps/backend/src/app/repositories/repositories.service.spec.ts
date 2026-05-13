import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RepositoriesService } from './repositories.service';
import { GithubService } from '../github/github.service';
import { UserService } from '../user/user.service';
import { WebhooksService } from '../webhooks/webhooks.service';
import { RepositoryEntity } from '../database/entities/repository.entity';

describe('RepositoriesService', () => {
  let service: RepositoriesService;
  const githubService = {
    getUserRepos: jest.fn(),
  };
  const repositoryRepo = {
    count: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
  };
  const userService = {
    updateUser: jest.fn(),
  };
  const webhookService = {
    checkWebhookAndCreate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepositoriesService,
        { provide: GithubService, useValue: githubService },
        { provide: getRepositoryToken(RepositoryEntity), useValue: repositoryRepo },
        { provide: UserService, useValue: userService },
        { provide: WebhooksService, useValue: webhookService },
      ],
    }).compile();

    service = module.get<RepositoriesService>(RepositoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch and save repos when user has none stored', async () => {
    repositoryRepo.count.mockResolvedValue(0);
    githubService.getUserRepos.mockResolvedValue([
      {
        id: 1,
        name: 'repo1',
        owner: { login: 'owner' },
        description: 'desc',
        private: false,
        language: 'ts',
        stargazers_count: 5,
        forks_count: 2,
        open_issues_count: 1,
        default_branch: 'main',
        html_url: 'https://github.com/owner/repo1',
        pushed_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      },
    ]);
    const saved = [{ id: 'repo-id', githubRepoId: '1', userId: 'user-id' }];
    repositoryRepo.save.mockResolvedValue(saved);

    const result = await service.getUserRepositories({ id: 'user-id', token: 'token' } as any);

    expect(repositoryRepo.count).toHaveBeenCalledWith({ where: { userId: 'user-id' } });
    expect(githubService.getUserRepos).toHaveBeenCalledWith('token');
    expect(repositoryRepo.save).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ githubRepoId: '1', userId: 'user-id' }),
      ]),
    );
    expect(userService.updateUser).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'user-id', lastRepoUpdate: expect.any(Date) }),
    );
    expect(result).toBe(saved);
  });

  it('should return stored repos when user has repos', async () => {
    repositoryRepo.count.mockResolvedValue(2);
    repositoryRepo.findAndCount.mockResolvedValue([[{ id: 'a' }], 1]);

    const result = await service.getUserRepositories({ id: 'user-id', token: 'token' } as any);

    expect(githubService.getUserRepos).not.toHaveBeenCalled();
    expect(repositoryRepo.findAndCount).toHaveBeenCalledWith({ where: { userId: 'user-id' } });
    expect(result).toEqual([[{ id: 'a' }], 1]);
  });

  it('should sync existing repositories and update user', async () => {
    const user = { id: 'user-id', token: 'token' } as any;
    repositoryRepo.findAndCount.mockResolvedValue([
      [
        {
          id: 'repo-1',
          githubRepoId: '1',
          repoName: 'repo1',
          owner: 'owner',
        },
      ],
      1,
    ]);
    githubService.getUserRepos.mockResolvedValue([
      {
        id: 1,
        name: 'repo1',
        owner: { login: 'owner' },
        description: 'desc',
        private: false,
        language: 'ts',
        stargazers_count: 5,
        forks_count: 2,
        open_issues_count: 1,
        default_branch: 'main',
        html_url: 'https://github.com/owner/repo1',
        pushed_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      },
    ]);
    repositoryRepo.save.mockResolvedValue([{}]);

    const result = await service.syncRepositories(user);

    expect(repositoryRepo.findAndCount).toHaveBeenCalledWith({ where: { userId: 'user-id' } });
    expect(githubService.getUserRepos).toHaveBeenCalledWith('token');
    expect(repositoryRepo.save).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 'repo-1', githubRepoId: '1' }),
      ]),
    );
    expect(userService.updateUser).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'user-id', lastRepoUpdate: expect.any(Date) }),
    );
    expect(result).toEqual([expect.objectContaining({ id: 'repo-1' })]);
  });

  it('should throw when subscribeOrUnsubscribeRepo called without user', async () => {
    await expect(service.subscribeOrUnsubscribeRepo('repo-id', undefined as any, true)).rejects.toThrow('Not user found!');
  });

  it('should throw when repo is not found for subscribe', async () => {
    repositoryRepo.findOne.mockResolvedValue(null);

    await expect(
      service.subscribeOrUnsubscribeRepo('repo-id', { id: 'user-id' } as any, true),
    ).rejects.toThrow('Repo repo-id dose not exsist!');
  });

  it('should update existing repo and create webhook when subscribing', async () => {
    const repo = { id: 'repo-id', userId: 'user-id', isSubscribed: false } as any;
    repositoryRepo.findOne.mockResolvedValue(repo);
    repositoryRepo.save.mockResolvedValue({ ...repo, isSubscribed: true });

    const result = await service.subscribeOrUnsubscribeRepo('repo-id', { id: 'user-id' } as any, true);

    expect(webhookService.checkWebhookAndCreate).toHaveBeenCalledWith(repo, { id: 'user-id' });
    expect(repositoryRepo.save).toHaveBeenCalledWith(expect.objectContaining({ isSubscribed: true }));
    expect(result).toEqual(expect.objectContaining({ isSubscribed: true }));
  });

  it('should update existing repo without creating webhook when unsubscribing', async () => {
    const repo = { id: 'repo-id', userId: 'user-id', isSubscribed: true } as any;
    repositoryRepo.findOne.mockResolvedValue(repo);
    repositoryRepo.save.mockResolvedValue({ ...repo, isSubscribed: false });

    const result = await service.subscribeOrUnsubscribeRepo('repo-id', { id: 'user-id' } as any, false);

    expect(webhookService.checkWebhookAndCreate).not.toHaveBeenCalled();
    expect(repositoryRepo.save).toHaveBeenCalledWith(expect.objectContaining({ isSubscribed: false }));
    expect(result).toEqual(expect.objectContaining({ isSubscribed: false }));
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service';
import { githubConfig } from '../../config/github.config';
import { GITHUB_AUTH_HTTP_CLIENT, GITHUB_HTTP_CLIENT } from '../../tokens';

describe('GithubService', () => {
  let service: GithubService;
  const githubMockConfig = {
    authBaseUrl: 'https://github.com',
    clientId: 'client-id',
    clientSecret: 'client-secret',
    webhookSecret: 'webhook-secret',
  };
  const httpClient = {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  };
  const authHttpClient = {
    post: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GithubService,
        { provide: githubConfig.KEY, useValue: githubMockConfig },
        { provide: GITHUB_HTTP_CLIENT, useValue: httpClient },
        { provide: GITHUB_AUTH_HTTP_CLIENT, useValue: authHttpClient },
      ],
    }).compile();

    service = module.get<GithubService>(GithubService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should build the correct GitHub login URL', () => {
    const url = service.getLoginUrl();

    expect(url).toContain(githubMockConfig.authBaseUrl);
    expect(url).toContain(`client_id=${githubMockConfig.clientId}`);
    expect(url).toContain('scope=scope=read:user user:email repo admin:repo_hook');
  });

  it('should parse access token from GitHub response', async () => {
    authHttpClient.post.mockResolvedValue('access_token=test-token&scope=repo');

    const token = await service.getAccessToken('abc123');

    expect(authHttpClient.post).toHaveBeenCalledWith(
      '/login/oauth/access_token?scope=admin:repo_hook repo write:repo_hook public_repo',
      {
        client_id: githubMockConfig.clientId,
        client_secret: githubMockConfig.clientSecret,
        code: 'abc123',
      },
    );
    expect(token).toBe('test-token');
  });

  it('should return user details from GitHub', async () => {
    const expected = { id: '1', login: 'test-user' };
    httpClient.get.mockResolvedValue(expected);

    const result = await service.getUserDeatils('token-123');

    expect(httpClient.get).toHaveBeenCalledWith('/user', {
      headers: {
        Authorization: 'Bearer token-123',
      },
    });
    expect(result).toEqual(expected);
  });

  it('should return repositories from GitHub', async () => {
    const repos = [{ id: 1 }, { id: 2 }];
    httpClient.get.mockResolvedValue(repos);

    const result = await service.getUserRepos('token-123');

    expect(httpClient.get).toHaveBeenCalledWith('/user/repos?scope=repo', {
      headers: {
        Authorization: 'Bearer token-123',
      },
    });
    expect(result).toEqual(repos);
  });

  it('should register webhook with correct body and headers', async () => {
    const webhookResponse = { id: 100 };
    httpClient.post.mockResolvedValue(webhookResponse);

    const response = await service.registerWebhook(
      'owner',
      'repo',
      'token-123',
      'https://example.com/webhook',
      ['push', 'pull_request'],
    );

    expect(httpClient.post).toHaveBeenCalledWith(
      '/repos/owner/repo/hooks',
      {
        name: 'web',
        active: true,
        events: ['push', 'pull_request'],
        config: {
          url: 'https://example.com/webhook',
          content_type: 'json',
          secret: githubMockConfig.webhookSecret,
        },
      },
      {
        headers: {
          Authorization: 'Bearer token-123',
        },
      },
    );
    expect(response).toEqual(webhookResponse);
  });

  it('should delete webhook using correct path and headers', async () => {
    const deleteResult = { success: true };
    httpClient.delete.mockResolvedValue(deleteResult);

    const result = await service.deleteWebhook('owner', 'repo', '42', 'token-123');

    expect(httpClient.delete).toHaveBeenCalledWith('/repos/owner/repo/hooks/42', {
      headers: {
        Authorization: 'Bearer token-123',
      },
    });
    expect(result).toEqual(deleteResult);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { GithubService } from '../github/github.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  const githubService = {
    getLoginUrl: jest.fn().mockReturnValue('https://github.com/login'),
    getAccessToken: jest.fn(),
    getUserDeatils: jest.fn(),
  };
  const userService = {
    getUserByGitHubId: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
  };
  const jwtService = {
    sign: jest.fn().mockReturnValue('signed-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: GithubService, useValue: githubService },
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return GitHub login URL from GithubService', () => {
    const url = service.getGithubLoginUrl();

    expect(githubService.getLoginUrl).toHaveBeenCalled();
    expect(url).toBe('https://github.com/login');
  });

  it('should create a new user and return jwt token when user does not exist', async () => {
    githubService.getAccessToken.mockResolvedValue('access-token');
    githubService.getUserDeatils.mockResolvedValue({
      id: 'github-id',
      login: 'tester',
      following: 3,
      followers: 5,
      avatar_url: 'avatar.png',
      bio: 'bio text',
      public_repos: 10,
      email: 'tester@example.com',
    });
    userService.getUserByGitHubId.mockResolvedValue(undefined);
    userService.createUser.mockResolvedValue({
      id: 'user-id',
      githubId: 'github-id',
      username: 'tester',
    });

    const token = await service.loginAndCreateUser('code-123');

    expect(githubService.getAccessToken).toHaveBeenCalledWith('code-123');
    expect(githubService.getUserDeatils).toHaveBeenCalledWith('access-token');
    expect(userService.getUserByGitHubId).toHaveBeenCalledWith('github-id');
    expect(userService.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        githubId: 'github-id',
        username: 'tester',
        token: 'access-token',
      }),
    );
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 'user-id',
      githubId: 'github-id',
      username: 'tester',
    });
    expect(token).toBe('signed-jwt-token');
  });

  it('should update existing user and return jwt token', async () => {
    const existingUser = {
      id: 'user-id',
      githubId: 'github-id',
      username: 'tester',
      token: 'old-token',
    };

    githubService.getAccessToken.mockResolvedValue('new-access-token');
    githubService.getUserDeatils.mockResolvedValue({
      id: 'github-id',
      login: 'tester',
      following: 2,
      followers: 4,
      avatar_url: 'avatar.png',
      bio: 'updated bio',
      public_repos: 7,
      email: 'tester@example.com',
    });
    userService.getUserByGitHubId.mockResolvedValue(existingUser);
    userService.updateUser.mockResolvedValue({ affected: 1 });

    const token = await service.loginAndCreateUser('code-456');

    expect(userService.updateUser).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'user-id',
        token: 'new-access-token',
      }),
    );
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 'user-id',
      githubId: 'github-id',
      username: 'tester',
    });
    expect(token).toBe('signed-jwt-token');
  });

  it('should throw unauthorized if GitHub service fails', async () => {
    githubService.getAccessToken.mockRejectedValue(new Error('invalid code'));

    await expect(service.loginAndCreateUser('bad-code')).rejects.toMatchObject({
      status: HttpStatus.UNAUTHORIZED,
      message: 'invalid code',
    });
  });
});

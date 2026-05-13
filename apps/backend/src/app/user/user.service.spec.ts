import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { GithubService } from '../github/github.service';
import { UserEntity } from '../database/entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  const userRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };
  const githubService = {
    getUserDeatils: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(UserEntity), useValue: userRepository },
        { provide: GithubService, useValue: githubService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get user by GitHub ID', async () => {
    const expectedUser = { id: 'user-id', githubId: 'github-id' };
    userRepository.findOne.mockResolvedValue(expectedUser);

    const result = await service.getUserByGitHubId('github-id');

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { githubId: 'github-id' },
    });
    expect(result).toBe(expectedUser);
  });

  it('should throw when getUserById is called without id', async () => {
    await expect(service.getUserById(undefined)).rejects.toThrow('User id is required!');
  });

  it('should create a new user with lastProfileUpdate set', async () => {
    const newUser = { githubId: 'github-id', username: 'tester' };
    const createdUser = { ...newUser, id: 'user-id' };
    userRepository.create.mockReturnValue(createdUser);
    userRepository.save.mockResolvedValue(createdUser);

    const result = await service.createUser(newUser as any);

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        githubId: 'github-id',
        username: 'tester',
      }),
    );
    expect(userRepository.save).toHaveBeenCalledWith(createdUser);
    expect(result).toBe(createdUser);
  });

  it('should update user through repository', async () => {
    const user = { id: 'user-id', username: 'tester' };
    userRepository.update.mockResolvedValue({ affected: 1 });

    const result = await service.updateUser(user as any);

    expect(userRepository.update).toHaveBeenCalledWith({ id: 'user-id' }, user);
    expect(result).toEqual({ affected: 1 });
  });

  it('should sync user when lastProfileUpdate is stale', async () => {
    const user = {
      id: 'user-id',
      githubId: 'github-id',
      token: 'token',
      lastProfileUpdate: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
    } as any;

    userRepository.findOne.mockResolvedValue(user);
    githubService.getUserDeatils.mockResolvedValue({
      id: 'github-id',
      login: 'tester',
      following: 1,
      followers: 2,
      avatar_url: 'avatar.png',
      bio: 'bio',
      public_repos: 4,
      email: 'tester@example.com',
    });
    userRepository.update.mockResolvedValue({ affected: 1 });

    await service.getUserById('user-id');

    expect(githubService.getUserDeatils).toHaveBeenCalledWith('token');
    expect(userRepository.update).toHaveBeenCalled();
  });
});

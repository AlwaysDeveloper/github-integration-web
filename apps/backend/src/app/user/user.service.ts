import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@github-web-integration/http-client';
import { GithubService } from '../github/github.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly github: GithubService,
  ) {}

  async getUserByGitHubId(id: string) {
    return this.userRepository.findOne({
      where: {
        githubId: id,
      },
    });
  }

  async getUserById(id: string | undefined) {
    if (!id) {
      throw new BadRequestException('User id is required!');
    }
    const result = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (result?.lastProfileUpdate) {
      const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

      const lastUpdated = result.lastProfileUpdate
        ? new Date(result.lastProfileUpdate).getTime()
        : 0;

      const now = Date.now();

      if (now - lastUpdated > THIRTY_DAYS_IN_MS) {
        return this.syncUser(result);
      }
    }

    return result;
  }

  async createUser(user: User) {
    const newUser: UserEntity = this.userRepository.create({
      ...user,
      lastProfileUpdate: new Date(),
    });
    return this.userRepository.save(newUser);
  }

  async updateUser(user: User) {
    return this.userRepository.update({ id: user.id }, user);
  }

  async syncUser(user: User) {
    const userDeatils = await this.github.getUserDeatils(user.token);
    const gitUser: User = {
        githubId: userDeatils.id,
        username: userDeatils.login,
        following: userDeatils.following,
        followers: userDeatils.followers,
        avatar: userDeatils.avatar_url,
        bio: userDeatils.bio,
        publicRepos: userDeatils.public_repos,
        lastProfileUpdate: new Date(),
        id: undefined,
        lastRepoUpdate: undefined,
        email: userDeatils.email,
        token: user.token,
    };
    gitUser.id = user.id;
    return this.updateUser(user);
  }
}

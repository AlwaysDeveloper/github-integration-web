import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GithubService } from '../github/github.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../database/entities/user.entity';
import { User } from '@github-web-integration/http-client';

@Injectable()
export class AuthService {
  constructor(
    private readonly githubService: GithubService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  getGithubLoginUrl() {
    return this.githubService.getLoginUrl();
  }

  async loginAndCreateUser(githubCode: string) {
    try {
      const token: string = await this.githubService.getAccessToken(githubCode);
      const userDeatils = await this.githubService.getUserDeatils(token);
      const gitUser: User = {
        githubId: userDeatils.id,
        username: userDeatils.login,
        following: userDeatils.following,
        followers: userDeatils.followers,
        avatar: userDeatils.avatar_url,
        bio: userDeatils.bio,
        publicRepos: userDeatils.public_repos,
        token: token,
        lastProfileUpdate: new Date(),
        id: undefined,
        lastRepoUpdate: undefined,
        email: userDeatils.email
      };
      let user = await this.userService.getUserByGitHubId(gitUser.githubId);
      if (!user) {
        user = await this.userService.createUser(gitUser);
      } else {
        await this.userService.updateUser({
          ...user,
          token: gitUser.token,
          lastProfileUpdate: gitUser.lastProfileUpdate,
        });
      }

      return this.generateJwt(user);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  private generateJwt(user: UserEntity) {
    const payload = {
      sub: user.id,
      githubId: user.githubId,
      username: user.username,
    };

    return this.jwtService.sign(payload);
  }
}

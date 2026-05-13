import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GithubService } from '../github/github.service';
import { User } from '@github-web-integration/http-client';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryEntity } from '../database/entities/repository.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { WebhooksService } from '../webhooks/webhooks.service';

@Injectable()
export class RepositoriesService {
  private readonly logger: Logger = new Logger(RepositoriesService.name);

  constructor(
    private readonly github: GithubService,
    @InjectRepository(RepositoryEntity)
    private readonly repository: Repository<RepositoryEntity>,
    private readonly userService: UserService,
    private readonly webhookService: WebhooksService
  ) {}

  async getUserRepositories(user: User) {
    const result = await this.repository.count({
      where: {
        userId: user.id,
      },
    });

    let repos;
    if (result === 0) {
      repos = await this.getRepositories(user.token);
      repos = await this.repository.save(
        Object.values(repos).map((item) => ({ ...item, userId: user.id })),
      );
      await this.userService.updateUser({
        ...user,
        lastProfileUpdate: new Date(),
        lastRepoUpdate: new Date(),
      });
      return repos;
    }

    return this.repository.findAndCount({ where: { userId: user.id } });
  }

  async syncRepositories(user: User) {
    const repoMap = await this.getRepositories(user.token);
    const userRepos = await this.repository.findAndCount({
      where: { userId: user.id },
    });

    const updatedRepos = userRepos[0].map((repo: RepositoryEntity) => {
      const cloudRepo = repoMap[repo.githubRepoId];
      cloudRepo['id'] = repo.id
      return cloudRepo;
    });

    await this.repository.save(updatedRepos);
    await this.userService.updateUser({
      ...user,
      lastProfileUpdate: new Date(),
      lastRepoUpdate: new Date(),
    });

    return updatedRepos;
  }

  private async getRepositories(token: string) {
    const result = (await this.github.getUserRepos(token)) as Record<
      string,
      any
    >[];
    return result.reduce((map, repo) => {
      map[repo.id] = {
        id: undefined,
        githubRepoId: repo.id.toString(),
        repoName: repo.name,
        owner: repo.owner.login, // needed for webhook URLs
        description: repo.description,
        isPublic: !repo.private,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        openIssues: repo.open_issues_count,
        defaultBranch: repo.default_branch,
        repoUrl: repo.html_url,
        pushedAt: repo.pushed_at,
        updatedAtGit: repo.updated_at,
      };
      return map;
    }, {});
  }

  async subscribeOrUnsubscribeRepo(
    repoId: string,
    user: User,
    isSubscribing: boolean,
  ) {
    if(!user) {
      throw new HttpException('Not user found!', HttpStatus.NOT_FOUND);
    }

    const repo: RepositoryEntity | null = await this.repository.findOne({
      where: {
        id: repoId,
        userId: user.id,
      },
    });

    if(!repo) {
      throw new NotFoundException(`Repo ${repoId} dose not exsist!`);
    }
    
    repo.isSubscribed = isSubscribing;

    if(repo.isSubscribed){
      await this.webhookService.checkWebhookAndCreate(repo, user);
    }

    await this.repository.save(repo);

    return repo;
  }
}

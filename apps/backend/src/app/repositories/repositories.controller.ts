import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';
import { RequestUser } from '../auth/user.decorator';
import { User } from '@github-web-integration/http-client';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/repositories')
export class RepositoriesController {
  constructor(private readonly service: RepositoriesService) {}

  @Get('')
  @UseGuards(AuthGuard)
  getRepositories(@RequestUser() user: User) {
    return this.service.getUserRepositories(user);
  }

  @Get('sync')
  @UseGuards(AuthGuard)
  syncRepositories(@RequestUser() user: User) {
    return this.service.syncRepositories(user);
  }

  @Post('/:repoId/subscribe')
  @UseGuards(AuthGuard)
  subscribe(@Param('repoId') repoId: string, @RequestUser() user: User) {
    return this.service.subscribeOrUnsubscribeRepo(repoId, user, true);
  }

  @Delete('/:repoId/unsubscribe')
  @UseGuards(AuthGuard)
  unsubscribe(@Param('repoId') repoId: string, @RequestUser() user: User) {
    return this.service.subscribeOrUnsubscribeRepo(repoId, user, false);
  }
}

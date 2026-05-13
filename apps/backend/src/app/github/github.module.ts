import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GITHUB_AUTH_HTTP_CLIENT, GITHUB_HTTP_CLIENT } from '../../tokens';
import { HttpClient } from '@github-web-integration/http-client';
import { ConfigType } from '@nestjs/config';
import { githubConfig } from '../../config/github.config';

@Module({
  providers: [
    {
      provide: GITHUB_HTTP_CLIENT,
      useFactory: (config: ConfigType<typeof githubConfig>) => {
        return new HttpClient({
          baseURL: config.baseUrl,
          retry: {
            enabled: true,
            retries: 3,
            retryDelay: 500,
          }
        })
      },
      inject: [githubConfig.KEY]
    },
    {
      provide: GITHUB_AUTH_HTTP_CLIENT,
      useFactory: (config: ConfigType<typeof githubConfig>) => {
        return new HttpClient({
          baseURL: config.authBaseUrl,
          retry: {
            enabled: true,
            retries: 3,
            retryDelay: 500,
          }
        })
      },
      inject: [githubConfig.KEY]
    },
    GithubService,
  ],
  exports: [GithubService],
})
export class GithubModule {}

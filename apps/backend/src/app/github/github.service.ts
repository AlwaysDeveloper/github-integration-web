import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { githubConfig } from '../../config/github.config';
import { GITHUB_AUTH_HTTP_CLIENT, GITHUB_HTTP_CLIENT } from '../../tokens';
import { HttpClient } from '@github-web-integration/http-client';

@Injectable()
export class GithubService {
  constructor(
    @Inject(githubConfig.KEY)
    private readonly github: ConfigType<typeof githubConfig>,
    @Inject(GITHUB_HTTP_CLIENT)
    private readonly httpClient: HttpClient,
    @Inject(GITHUB_AUTH_HTTP_CLIENT)
    private readonly authHttpClient: HttpClient,
  ) {}

  getLoginUrl() {
    return `${this.github.authBaseUrl}/login/oauth/authorize?client_id=${this.github.clientId}&scope=scope=read:user user:email repo admin:repo_hook`;
  }

  async getAccessToken(userCode: string): Promise<string> {
    const response = (await this.authHttpClient.post(
      '/login/oauth/access_token?scope=admin:repo_hook repo write:repo_hook public_repo',
      {
        client_id: this.github.clientId,
        client_secret: this.github.clientSecret,
        code: userCode,
      },
    )) as string;
    return response.split('&')[0].split('=')[1];
  }

  async getUserDeatils(accessToken: string) {
    const response = (await this.httpClient.get('/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })) as Record<string, any>;
    return response;
  }

  async getUserRepos(accessToken: string) {
    const response = await this.httpClient.get('/user/repos?scope=repo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  }

  async registerWebhook(
    owner: string,
    repo: string,
    accessToken: string,
    webhookUrl: string,
    events: string[],
  ) {
    const response = await this.httpClient.post(
      `/repos/${owner}/${repo}/hooks`,
      {
        name: 'web',
        active: true,
        events,
        config: {
          url: webhookUrl,
          content_type: 'json',
          secret: this.github.webhookSecret,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response;
  }

  async deleteWebhook(
    owner: string,
    repo: string,
    hookId: string,
    accessToken: string,
  ) {
    const response = await this.httpClient.delete(
      `/repos/${owner}/${repo}/hooks/${hookId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  }
}

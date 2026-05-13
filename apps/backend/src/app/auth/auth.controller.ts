import { Controller, Get, Inject, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { authConfig } from '../../config/auth.config';
import type { ConfigType } from '@nestjs/config';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>
) {}

  @Get()
  getLoginUrl() {
    return this.service.getGithubLoginUrl();
  }

  @Get('/github/callback')
  async getAuthTokenAndRedirect(
    @Query('code') code: string,
    @Res() res: Response,
  ) {
    const token = await this.service.loginAndCreateUser(code);

    res.cookie('access_token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(this.config.frontendBase || '');
  }
}

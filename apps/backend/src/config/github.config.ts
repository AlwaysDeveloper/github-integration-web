import { registerAs } from '@nestjs/config';

export const githubConfig = registerAs('github', () => ({
    baseUrl: process.env.GUTHUB_API_BASE_URL,
    authBaseUrl: process.env.GITHUB_BASE_URL,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    webhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
}));

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubModule } from './github/github.module';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { githubConfig } from '../config/github.config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { authConfig } from '../config/auth.config';
import { RepositoriesModule } from './repositories/repositories.module';
import { WebHooksModule } from './webhooks/webhooks.module';
import { RabbitMQModule } from '@github-web-integration/rabbitmq';
import { systemConfig } from '../config/config.config';
import { PullRequestsModule } from './pull-requests/pull-requests.module';
import { NotificationModule } from './notification/notification.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '@github-web-integration/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [githubConfig, authConfig, systemConfig],
    }),
    GithubModule,
    AuthModule,
    DatabaseModule,
    UserModule,
    RepositoriesModule,
    WebHooksModule,
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [systemConfig.KEY],
      useFactory: async (config: ConfigType<typeof systemConfig>) => ({
        uri: config.amqpUri,
        prefetchCount: 10,
        exchanges: [
          {
            name: 'github.events',
            type: 'topic',
          },
          {
            name: 'notification.events',
            type: 'topic',
          },
        ],
      }),
    }),
    PullRequestsModule,
    NotificationModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }
  ],
})
export class AppModule {}

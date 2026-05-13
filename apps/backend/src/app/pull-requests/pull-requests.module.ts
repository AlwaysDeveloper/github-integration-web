import { Module } from '@nestjs/common';
import { PullRequetsController } from './pull-requests.controller';
import { PullRequestsService } from './pull-requests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PullRequestEntity } from '../database/entities/pull-request.entity';
import { RepositoryEntity } from '../database/entities/repository.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([PullRequestEntity, RepositoryEntity])
    ],
    controllers: [PullRequetsController],
    providers: [PullRequestsService]
})
export class PullRequestsModule {}

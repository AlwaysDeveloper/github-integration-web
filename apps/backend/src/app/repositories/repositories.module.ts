import { Module } from "@nestjs/common";
import { GithubModule } from "../github/github.module";
import { RepositoriesController } from "./repositories.controller";
import { RepositoriesService } from "./repositories.service";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RepositoryEntity } from "../database/entities/repository.entity";
import { WebHooksModule } from "../webhooks/webhooks.module";

@Module({
    imports: [
        GithubModule,
        AuthModule,
        UserModule,
        TypeOrmModule.forFeature([RepositoryEntity]),
        UserModule,
        WebHooksModule
    ],
    controllers: [RepositoriesController],
    providers: [RepositoriesService]
})
export class RepositoriesModule {}
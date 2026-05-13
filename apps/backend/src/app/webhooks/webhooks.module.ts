import { Module } from "@nestjs/common";
import { GithubModule } from "../github/github.module";
import { WebhooksService } from "./webhooks.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WebhookEntity } from "../database/entities/webhooks.entity";
import { WebhookController } from "./webhooks.controller";

@Module({
    imports: [
        GithubModule,
        TypeOrmModule.forFeature([WebhookEntity])
    ],
    providers: [WebhooksService],
    exports: [WebhooksService],
    controllers: [WebhookController]
})
export class WebHooksModule {}
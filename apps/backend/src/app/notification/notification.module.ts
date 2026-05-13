import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationEntity } from "../database/entities/notification.entity";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { NotificationConsumer } from "./notification.consumer";
import { EmailTransport } from "./email.transport";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([NotificationEntity]),
        UserModule,
    ],
    controllers: [NotificationController],
    providers: [NotificationService, NotificationConsumer, EmailTransport]
})
export class NotificationModule {}
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../database/entities/user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthModule } from "../auth/auth.module";
import { GithubModule } from "../github/github.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        forwardRef(() => AuthModule),
        GithubModule
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}
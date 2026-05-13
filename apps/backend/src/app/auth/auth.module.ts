import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { GithubModule } from "../github/github.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../database/entities/user.entity";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { authConfig } from "../../config/auth.config";
import { ConfigType } from "@nestjs/config";
import { AuthGuard } from "./auth.guard";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        GithubModule,
        forwardRef(() => UserModule),
        JwtModule.registerAsync({
            inject: [authConfig.KEY],
            useFactory: (config: ConfigType<typeof authConfig>) => ({
                secret: config.jwtSecret,
                signOptions: { expiresIn: "7d" },
            })
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthGuard],
    exports: [AuthGuard, JwtModule]
})
export class AuthModule {}
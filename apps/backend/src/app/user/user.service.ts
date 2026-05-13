import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { UserEntity } from "../database/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@github-web-integration/http-client";
import { GithubService } from "../github/github.service";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly github: GithubService,
    ) {}

    async getUserByGitHubId(id: string) {
        return this.userRepository.findOne({
            where: {
                githubId: id
            }
        })
    }

    async getUserById(id: string | undefined) {
        if(!id) {
            throw new BadRequestException('User id is required!');
        }
        return this.userRepository.findOne({
            where: {
                id
            }
        })
    }

    async createUser(user: User) {
        const newUser: UserEntity = this.userRepository.create({...user, lastProfileUpdate: new Date()});
        return this.userRepository.save(newUser);
    }

    async updateUser(user: User) {
        return this.userRepository.update({ id: user.id }, user);
    }

    async syncUser(user: User) {
        const githubUserProfile = await this.github.getUserDeatils(user.token);
        return githubUserProfile;
    }
}
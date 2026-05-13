import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "../auth/auth.guard";
import { RequestUser } from "../auth/user.decorator";
import { User } from "@github-web-integration/http-client";

@Controller('/user')
export class UserController {
    constructor(
        private readonly service: UserService
    ) {}

    @Get('/profile')
    @UseGuards(AuthGuard)
    async getUserDeatils(@RequestUser() user: User) {
        return this.service.getUserById(user.id)
    }

    @Get('/profile/sync')
    @UseGuards(AuthGuard)
    async syncUserDetails(@RequestUser() user: User) {
        return this.service.syncUser(user);
    }

    @Put('/profile')
    @UseGuards(AuthGuard)
    async updateUser(@RequestUser() user: User, @Body() data: User) {
        data.id = user.id;
        return this.service.updateUser(data);
    }
}
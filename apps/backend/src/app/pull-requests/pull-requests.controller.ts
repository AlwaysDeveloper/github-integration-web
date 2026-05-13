import { Controller } from "@nestjs/common";
import { PullRequestsService } from "./pull-requests.service";

@Controller('pull-requests')
export class PullRequetsController {
    constructor(
        private readonly service: PullRequestsService
    ) {}
}
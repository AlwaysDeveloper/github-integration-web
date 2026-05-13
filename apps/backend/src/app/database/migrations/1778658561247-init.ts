import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778658561247 implements MigrationInterface {
    name = 'Init1778658561247'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`pull_requests\` (\`id\` varchar(36) NOT NULL, \`githubPullRequestId\` varchar(100) NOT NULL, \`githubRepositoryId\` varchar(100) NOT NULL, \`pullRequestNumber\` int NOT NULL, \`action\` varchar(50) NOT NULL, \`state\` varchar(20) NOT NULL, \`merged\` tinyint NOT NULL DEFAULT 0, \`mergedAt\` timestamp NULL, \`closedAt\` timestamp NULL, \`title\` varchar(500) NOT NULL, \`body\` text NULL, \`htmlUrl\` varchar(500) NOT NULL, \`diffUrl\` varchar(500) NOT NULL, \`patchUrl\` varchar(500) NOT NULL, \`headBranch\` varchar(255) NOT NULL, \`baseBranch\` varchar(255) NOT NULL, \`headSha\` varchar(255) NOT NULL, \`commits\` int NOT NULL DEFAULT '0', \`additions\` int NOT NULL DEFAULT '0', \`deletions\` int NOT NULL DEFAULT '0', \`changedFiles\` int NOT NULL DEFAULT '0', \`comments\` int NOT NULL DEFAULT '0', \`reviewComments\` int NOT NULL DEFAULT '0', \`authorUsername\` varchar(255) NOT NULL, \`authorAvatarUrl\` text NOT NULL, \`authorProfileUrl\` text NOT NULL, \`senderUsername\` varchar(255) NOT NULL, \`githubCreatedAt\` timestamp NOT NULL, \`githubUpdatedAt\` timestamp NOT NULL, \`rawPayload\` json NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_68262c1f29c05113f59c915700\` (\`githubRepositoryId\`, \`pullRequestNumber\`), UNIQUE INDEX \`IDX_81dbeb9ac91097813c6463d635\` (\`githubPullRequestId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`pull_requests\` ADD CONSTRAINT \`FK_9dcab8a350661aa36cb5382c414\` FOREIGN KEY (\`githubRepositoryId\`) REFERENCES \`repositories\`(\`githubRepoId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pull_requests\` DROP FOREIGN KEY \`FK_9dcab8a350661aa36cb5382c414\``);
        await queryRunner.query(`DROP INDEX \`IDX_81dbeb9ac91097813c6463d635\` ON \`pull_requests\``);
        await queryRunner.query(`DROP INDEX \`IDX_68262c1f29c05113f59c915700\` ON \`pull_requests\``);
        await queryRunner.query(`DROP TABLE \`pull_requests\``);
    }

}

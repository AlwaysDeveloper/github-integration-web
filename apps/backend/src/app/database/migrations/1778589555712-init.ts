import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778589555712 implements MigrationInterface {
    name = 'Init1778589555712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`repositories\` (\`id\` varchar(36) NOT NULL, \`githubRepoId\` varchar(100) NOT NULL, \`repoName\` varchar(255) NOT NULL, \`owner\` varchar(100) NOT NULL, \`description\` text NULL, \`isPublic\` tinyint NOT NULL DEFAULT 1, \`language\` varchar(100) NULL, \`stars\` int NOT NULL DEFAULT '0', \`forks\` int NOT NULL DEFAULT '0', \`openIssues\` int NOT NULL DEFAULT '0', \`defaultBranch\` varchar(100) NOT NULL, \`repoUrl\` text NOT NULL, \`pushedAt\` timestamp NULL, \`updatedAtGit\` timestamp NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_a477894a09b73af227d8395187\` (\`githubRepoId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_a477894a09b73af227d8395187\` ON \`repositories\``);
        await queryRunner.query(`DROP TABLE \`repositories\``);
    }

}

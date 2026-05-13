import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778572650041 implements MigrationInterface {
    name = 'Init1778572650041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`username\` varchar(100) NOT NULL, \`githubId\` varchar(100) NOT NULL, \`avatar\` text NULL, \`bio\` text NULL, \`followers\` int NOT NULL DEFAULT '0', \`following\` int NOT NULL DEFAULT '0', \`publicRepos\` int NOT NULL DEFAULT '0', \`lastProfileUpdate\` timestamp NULL, \`token\` text NULL, \`refreshToken\` text NULL, \`lastRepoUpdate\` timestamp NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_42148de213279d66bf94b363bf\` (\`githubId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_42148de213279d66bf94b363bf\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}

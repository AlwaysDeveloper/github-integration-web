import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778591340277 implements MigrationInterface {
    name = 'Init1778591340277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`repositories\` ADD \`userId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`repositories\` ADD CONSTRAINT \`FK_2f29c355d9fefd2d8cf3bd79803\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`repositories\` DROP FOREIGN KEY \`FK_2f29c355d9fefd2d8cf3bd79803\``);
        await queryRunner.query(`ALTER TABLE \`repositories\` DROP COLUMN \`userId\``);
    }

}

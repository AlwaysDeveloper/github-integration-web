import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778603117842 implements MigrationInterface {
    name = 'Init1778603117842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`repositories\` ADD \`isSubscribed\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`repositories\` DROP COLUMN \`isSubscribed\``);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778574487084 implements MigrationInterface {
    name = 'Init1778574487084'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastProfileUpdate\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastProfileUpdate\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastRepoUpdate\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastRepoUpdate\` date NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastRepoUpdate\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastRepoUpdate\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastProfileUpdate\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastProfileUpdate\` timestamp NULL`);
    }

}

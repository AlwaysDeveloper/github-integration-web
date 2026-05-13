import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778663878263 implements MigrationInterface {
    name = 'Init1778663878263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(100) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(100) NOT NULL`);
    }

}

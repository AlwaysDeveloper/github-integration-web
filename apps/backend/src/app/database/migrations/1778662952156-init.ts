import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778662952156 implements MigrationInterface {
    name = 'Init1778662952156'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`notifications\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`message\` text NOT NULL, \`metadata\` json NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_692a909ee0fa9383e7859f9b40\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_692a909ee0fa9383e7859f9b40\` ON \`notifications\``);
        await queryRunner.query(`DROP TABLE \`notifications\``);
    }

}

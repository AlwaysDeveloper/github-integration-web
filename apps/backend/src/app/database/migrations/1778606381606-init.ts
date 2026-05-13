import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778606381606 implements MigrationInterface {
    name = 'Init1778606381606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`webhooks\` (\`id\` varchar(36) NOT NULL, \`githubWebhookId\` varchar(100) NOT NULL, \`webhookUrl\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`events\` text NOT NULL, \`repositoryId\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`webhooks\` ADD CONSTRAINT \`FK_039ce10ab6522e00d59c6d9dd6a\` FOREIGN KEY (\`repositoryId\`) REFERENCES \`repositories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`webhooks\` DROP FOREIGN KEY \`FK_039ce10ab6522e00d59c6d9dd6a\``);
        await queryRunner.query(`DROP TABLE \`webhooks\``);
    }

}

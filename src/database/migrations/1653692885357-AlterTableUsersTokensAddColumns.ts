import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterTableUsersTokensAddColumns1653692885357 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("users_tokens", new TableColumn({
            name: "is_valid",
            type: "boolean",
            default: true

        }))
        await queryRunner.addColumn("users_tokens", new TableColumn({
            name: "was_used",
            type: "boolean",
            default: false
        }))
        await queryRunner.addColumn("users_tokens", new TableColumn({
            name: "token_family",
            type: "uuid",

        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropColumns("users_tokens", ["is_valid", "was_used", "token_family"])

    }

}

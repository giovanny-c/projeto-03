import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterTableUsersAddColumnsIsConfirmed1653575693357 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("users", new TableColumn({
            name: "is_confirmed",
            type: "boolean",
            default: false
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "is_confirmed")
    }

}

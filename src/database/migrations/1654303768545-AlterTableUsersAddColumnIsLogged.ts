import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterTableUsersAddColumnIsLogged1654303768545 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("users", new TableColumn({
            name: "is_logged",
            type: "boolean",
            default: false

        }))

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "is_logged")
    }

}

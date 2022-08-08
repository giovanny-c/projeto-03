import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterTableStorageAddColumnPermitions1659985595443 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.addColumn("storage", new TableColumn({
            name: "permission",
            type: "varchar",
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("storage", "permission")
    }

}

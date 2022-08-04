import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterTableStorageAddColumnStorageType1659625400378 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("storage", new TableColumn({
            name: "storage_type",
            type: "varchar",
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("storage", "storage_type")
    }

}

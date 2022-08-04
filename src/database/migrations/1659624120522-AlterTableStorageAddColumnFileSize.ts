import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterTableStorageAddColumnFileSize1659624120522 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("storage", new TableColumn({
            name: "size",
            type: "numeric",
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("storage", "size")
    }

}

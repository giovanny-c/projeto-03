import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class alterTalbleStorageAddColumnExtension1659548130954 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("storage", new TableColumn({

            name: "extension",
            type: "varchar",
            isNullable: true

        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("storage", "extension")
    }

}

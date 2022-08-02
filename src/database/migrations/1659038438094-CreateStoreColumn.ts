import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateStoreColumn1659038438094 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "storage",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,

                },
                {
                    name: "user_id",
                    type: "uuid",
                    isNullable: false
                },
                {
                    name: "name",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "mime_type",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    isNullable: false
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    isNullable: true
                },


            ],

            foreignKeys: [
                {
                    name: "FKUserStorageData",
                    referencedTableName: "users",
                    referencedColumnNames: ["id"], //de users
                    columnNames: ["user_id"], //de storage
                    onDelete: "RESTRICT",
                    onUpdate: "RESTRICT"
                }
            ]


        }))


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("storage", "FKUserStorageData")
        await queryRunner.dropTable("storage")
    }

}

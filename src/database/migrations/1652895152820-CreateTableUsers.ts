import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateTableUsers1652895152820 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "users",

            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "uuid",
                    default: 'uuid_generate_v4()',
                },
                {
                    name: "name",
                    type: "varchar"

                },
                {
                    name: "email",
                    type: "varchar"

                },
                {
                    name: "password_hash",
                    type: "varchar"
                },
                {
                    name: "salt",
                    type: "varchar",
                    isNullable: true
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users")
    }

}

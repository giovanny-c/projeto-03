import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterDatabaseTimezone1653574447141 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER DATABASE projeto03_database SET timezone TO 'America/Sao_Paulo'`

        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER DATABASE projeto03_database SET timezone TO 'etc/UTC'`
        )
    }

}

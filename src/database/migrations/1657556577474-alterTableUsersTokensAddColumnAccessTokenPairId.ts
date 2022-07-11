import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class alterTableUsersTokensAddColumnAccessTokenPairId1657556577474 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("users_tokens", new TableColumn({
            name: "access_token_pair_id",
            type: "varchar",
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users_tokens", "access_token_pair_id")
    }

}

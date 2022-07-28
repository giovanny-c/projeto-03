import "reflect-metadata"
import { DataSource } from "typeorm";

export const dataSourceORM: DataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "root",
    password: "1234",
    database: "projeto03_database",
    // migrationsRun: true,
    // logging: true,
    entities: [
        "src/modules/**/entities/*.ts"
    ],
    migrations: [
        "src/database/migrations/*.ts"
    ],
})
//yarn typeorm migration:create ./src/database/migrations/migratioName
dataSourceORM.initialize()
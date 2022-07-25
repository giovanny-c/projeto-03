import "reflect-metadata"
import { DataSource } from "typeorm";


export const dataSource: DataSource = new DataSource({
    type: "postgres",
    host: "database_projeto03",
    port: 5432,
    username: "root",
    password: "1234",
    database: "projeto03_database",
    migrationsRun: true,
    //logging: true,
    entities: [
        "src/modules/**/entities/*.ts"
    ],
    migrations: [
        "src/database/migrations/*.ts"
    ],
})

dataSource.initialize()




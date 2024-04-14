import { DataSource } from 'typeorm'

export const dbSource = new DataSource({
    type: "postgres",
    host: process.env.PSQL_HOST,
    port: Number(process.env.PSQL_PORT),
    username: process.env.PSQL_USERNAME,
    password: process.env.PSQL_PASSWORD,
    database: process.env.PSQL_DATABASE,
    synchronize: true,
    logging: false,
    entities: ["src/models/*.ts"],
})
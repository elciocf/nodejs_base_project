// eslint-disable-next-line import/no-import-module-exports
import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
    development: {
        client: "mysql",
        connection: {
            host: "localhost",
            database: "kibird",
            user: "root",
            password: "root123",
            port: 3306,
            timezone: "UTC",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "migrations",
            directory: "./src/shared/knex/migrations",
        },
        seeds: {
            directory: "./src/shared/knex/seeds",
        },
    },

    production: {
        client: "mysql",
        connection: {
            host: "localhost",
            database: "database_name",
            user: "root",
            password: "root123",
            port: 3306,
            timezone: "UTC",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "migrations",
            directory: "./src/shared/knex/migrations",
        },
        seeds: {
            directory: "./src/shared/knex/seeds",
        },
    },
};

module.exports = config;

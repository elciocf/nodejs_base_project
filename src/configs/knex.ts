/* eslint-disable import/no-import-module-exports */

import knex from "knex";

const db = knex({
    client: "mysql",
    connection: {
        host: "localhost",
        database: "autoserv",
        user: "root",
        password: "root123",
        port: 3306,
        timezone: "UTC",
    },
    pool: {
        afterCreate(connection, callback) {
            // eslint-disable-next-line func-names, @typescript-eslint/no-explicit-any
            connection.query(`SET time_zone = "-03:00";`, function (err: any) {
                callback(err, connection);
            });
        },
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
});

export { db };

import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("refresh_tokens", (t) => {
        t.increments("cod_token");
        t.integer("cod_usuario")
            .unsigned()
            .notNullable()
            .references("cod_usuario")
            .inTable("usuarios")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        t.text("refresh_token");
        t.dateTime("expira_em");
        t.primary(["cod_token"]);
        t.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("refresh_tokens");
}

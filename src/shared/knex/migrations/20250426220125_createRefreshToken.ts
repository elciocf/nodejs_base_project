import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("refresh_tokens", (t) => {
        t.integer("cod_token");
        t.integer("cod_usuario");
        t.text("refresh_token");
        t.dateTime("expira_em");
        t.primary(["cod_token"]);
        t.timestamps(true, true);
        t.foreign(["cod_usuario"], "FK_cod_usuario_trefresh_tokens")
            .references(["cod_usuario"])
            .inTable("usuarios");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("refresh_tokens");
}

import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("usuarios", (t) => {
        t.integer("cod_tipo_usuario")
            .unsigned()
            .notNullable()
            .references("cod_tipo_usuario")
            .inTable("tipos_usuario")
            .alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("usuarios", (t) => {
        t.integer("cod_tipo_usuario").alter();
    });
}

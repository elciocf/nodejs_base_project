import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("usuarios", (t) => {
        t.integer("cod_tipo_usuario")
            .unsigned()
            .notNullable()
            .references("cod_tipo_usuario")
            .inTable("tipos_usuario")
            .onDelete("CASCADE")
            .onUpdate("CASCADE")
            .alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    // drop foreign key
    return knex.schema.alterTable("usuarios", (t) => {
        t.dropForeign("cod_tipo_usuario");
        t.integer("cod_tipo_usuario").unsigned().alter();
    });
}

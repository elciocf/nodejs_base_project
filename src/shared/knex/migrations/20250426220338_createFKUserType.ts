import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("usuarios", (t) => {
        t.foreign(["cod_tipo_usuario"], "FK_cod_tipo_usuario")
            .references(["cod_tipo_usuario"])
            .inTable("tipos_usuario");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("usuarios", (t) => {
        t.dropForeign(["cod_tipo_usuario"], "FK_cod_tipo_usuario");
    });
}

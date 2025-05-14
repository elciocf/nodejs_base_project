import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("tipos_usuario", (t) => {
        t.increments("cod_tipo_usuario");
        t.string("descricao", 100);
        t.primary(["cod_tipo_usuario"]);
        t.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("tipos_usuario");
}

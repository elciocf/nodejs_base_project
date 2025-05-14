import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("usuarios_adm", (t) => {
        t.increments("cod_usuario_adm");
        t.string("nome", 150);
        t.string("login", 50);
        t.string("senha", 255);
        t.string("email", 200);
        t.primary(["cod_usuario_adm"]);
        t.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("usuarios_adm");
}

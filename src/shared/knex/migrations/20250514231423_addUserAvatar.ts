import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("usuarios", (t) => {
        t.string("avatar", 255);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("usuarios", (t) => {
        t.dropColumn("avatar");
    });
}

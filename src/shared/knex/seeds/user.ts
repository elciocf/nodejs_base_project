import { hash } from "bcryptjs";
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("usuarios").del();
    await knex("tipos_usuario").del();

    // Inserts seed entries
    await knex("tipos_usuario").insert([
        { cod_tipo_usuario: 1, descricao: "master" },
    ]);

    const passwordHash = await hash("Elcio@123", 8);
    await knex("usuarios").insert([
        {
            cod_usuario: 1,
            nome: "Elcio",
            email: "elcio@teste.com.br",
            login: "elcio",
            senha: passwordHash,
            cod_tipo_usuario: 1,
        },
    ]);
}

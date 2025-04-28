import { hash } from "bcryptjs";
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("usuarios_adm").del();

    const passwordHash = await hash("Elcio@123", 8);
    await knex("usuarios_adm").insert([
        {
            cod_usuario_adm: 1,
            nome: "Elcio",
            email: "elcio@teste.com.br",
            login: "elcio",
            senha: passwordHash,
        },
    ]);
}

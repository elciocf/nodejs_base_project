import { db } from "@configs/knex";

async function runSeeds() {
    const seeds = ["admUser", "user"];

    console.log("Iniciando execução dos seeds...");

    // eslint-disable-next-line no-restricted-syntax
    for (const seed of seeds) {
        console.log(`Executando seed: ${seed}`);
        // eslint-disable-next-line no-await-in-loop
        await db.seed.run({ specific: `${seed}.ts` });
    }

    console.log("Seeds executados com sucesso!");
    await db.destroy(); // Fecha conexão com o banco
}

runSeeds().catch((err) => {
    console.error("Erro ao executar seeds:", err);
    process.exit(1);
});

import { input, select } from "@inquirer/prompts";
import fs from "fs";
import Handlebars from "handlebars";
import path from "path";

Handlebars.registerHelper("ifEquals", function ifEquals(arg1, arg2, options) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});

// --- Funções utilitárias ---

function pascalCase(str: string) {
    return str.replace(/(^\w|_\w)/g, (m) => m.replace("_", "").toUpperCase());
}

function lowerFirstLetter(str: string) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFileIfNotExists(filename: string, data: string) {
    if (!fs.existsSync(filename))
        fs.writeFileSync(filename, data, { flag: "wx" });
}

// --- CLI ---
async function main() {
    // 1. Pergunta o módulo
    let module = await input({
        message: "Qual o nome do módulo? <ls - para listar>",
    });

    // 2. Se o usuário digitar "ls", lista os módulos
    if (module === "ls") {
        const modules = fs
            .readdirSync("src/modules")
            .filter((file) =>
                fs.statSync(path.join("src/modules", file)).isDirectory()
            );

        module = await select({
            message: "Selecione o módulo",
            choices: modules,
        });
    }

    const moduleDir = path.resolve("src/modules/", module);
    ensureDir(moduleDir);

    // 2. Pergunta o nome da entidade
    const entity = await input({ message: "Qual o nome da entidade?" });
    const entityPascal = pascalCase(entity);
    // const entityLower = lowerFirstLetter(entity);
    // const entityDir = path.join(moduleDir, entityLower);
    const entityDir = moduleDir;
    ensureDir(entityDir);

    console.log("entityDir", entityDir);

    // 3. Pede o JSON com os campos
    /*
    const fieldsFile = await input({
        message: "Caminho para o arquivo JSON dos campos:",
        validate: (input) => fs.existsSync(input) || "Arquivo não encontrado.",
    }); */

    const fieldsFile = path.resolve(__dirname, "fields.json");

    const fields: { [key: string]: string } = JSON.parse(
        fs.readFileSync(fieldsFile, "utf-8")
    );

    // 2.1 Pergunta o nome da tabela da entidade
    const tableName = await input({
        message: "Qual o nome da tabela?",
    });

    // 2.2 Pergunta o campo PK - first field as default
    const firstField = Object.keys(fields)[0];
    const pkField = await input({
        message: "Qual o nome do campo PK?",
        default: firstField,
    });

    // --- Criação das pastas padrões ---
    const folders = ["dto", "entities", "repositories", "repositories/knex"];
    folders.forEach((folder) => ensureDir(path.join(entityDir, folder)));

    // --- Carrega templates ---
    function compileTemplate(templateName: string) {
        const raw = fs.readFileSync(
            path.resolve(__dirname, "templates", `${templateName}.hbs`),
            "utf8"
        );
        return Handlebars.compile(raw);
    }

    // --- Escreve arquivos ---

    // 1. DTO
    const dtoTpl = compileTemplate("DTO");
    writeFileIfNotExists(
        path.join(entityDir, "dto", `${entityPascal}DTO.ts`),
        dtoTpl({ entity: entityPascal, entity_pk: pkField, fields })
    );

    // 2. Entidade
    const entityTpl = compileTemplate("Entity");
    writeFileIfNotExists(
        path.join(entityDir, "entities", `${entityPascal}.ts`),
        entityTpl({
            entity: entityPascal,
            entity_pk: pkField,
            table: tableName,
            fields,
        })
    );

    // 3. Interface de Repositório
    const repoTpl = compileTemplate("IRepository");
    writeFileIfNotExists(
        path.join(entityDir, "repositories", `I${entityPascal}Repository.ts`),
        repoTpl({
            module,
            entity: entityPascal,
            entity_pk: pkField,
            table: tableName,
            fields,
        })
    );

    // 4. Repositório
    const repoKnexTpl = compileTemplate("Repository");
    writeFileIfNotExists(
        path.join(
            entityDir,
            "repositories",
            "knex",
            `${entityPascal}Repository.ts`
        ),
        repoKnexTpl({
            module,
            entity: entityPascal,
            entity_pk: pkField,
            table: tableName,
            fields,
        })
    );

    console.log("Arquivos criados com sucesso!");
}

main();

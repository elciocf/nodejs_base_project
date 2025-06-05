import { input, select } from "@inquirer/prompts";
import fs from "fs";
import Handlebars from "handlebars";
import path from "path";

import {
    ensureDir,
    pascalCase,
    runEslintOnFiles,
    writeFileIfNotExists,
} from "./utils";

Handlebars.registerHelper("ifEquals", function ifEquals(arg1, arg2, options) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});

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
    } else {
        // Verifica se o módulo existe
        const moduleExists = path.join("src/modules", module);
        if (!fs.existsSync(moduleExists)) {
            const createFolder = await select({
                message: "Criar pasta do módulo?",
                choices: ["Sim", "Não"],
            });

            if (createFolder === "Sim") {
                // Cria o diretório do módulo
                ensureDir(moduleExists);
                console.log(`Módulo ${module} criado com sucesso!`);
            } else {
                console.error(`Módulo ${module} não encontrado.`);
                return;
            }
        }
    }

    const moduleDir = path.resolve("src/modules/", module);
    ensureDir(moduleDir);

    // 2. Pergunta o nome da entidade
    const entity = await input({ message: "Qual o nome da entidade?" });
    const entityPascal = pascalCase(entity);

    // 2.1 Pergunta o nome da entidade no plural
    const entityPlural = await input({
        message: "Qual o nome da entidade no plural?",
        default: `${entityPascal}s`,
    });

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
    const folders = ["dtos", "entities", "repositories", "repositories/knex"];
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
    const files = [];

    // 1. DTO
    const dtoTpl = compileTemplate("DTO");
    writeFileIfNotExists(
        path.join(entityDir, "dtos", `I${entityPascal}DTO.ts`),
        dtoTpl({ entity: entityPascal, entity_pk: pkField, fields })
    );

    files.push(path.join(entityDir, "dtos", `I${entityPascal}DTO.ts`));

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
    files.push(path.join(entityDir, "entities", `${entityPascal}.ts`));

    // 3. Interface de Repositório
    const repoTpl = compileTemplate("IRepository");
    writeFileIfNotExists(
        path.join(entityDir, "repositories", `I${entityPlural}Repository.ts`),
        repoTpl({
            module,
            entityPlural,
            entity: entityPascal,
            entity_pk: pkField,
            table: tableName,
            fields,
        })
    );
    files.push(
        path.join(entityDir, "repositories", `I${entityPlural}Repository.ts`)
    );

    // 4. Repositório
    const repoKnexTpl = compileTemplate("Repository");
    writeFileIfNotExists(
        path.join(
            entityDir,
            "repositories",
            "knex",
            `${entityPlural}Repository.ts`
        ),
        repoKnexTpl({
            module,
            entityPlural,
            entity: entityPascal,
            entity_pk: pkField,
            table: tableName,
            fields,
        })
    );

    files.push(
        path.join(
            entityDir,
            "repositories",
            "knex",
            `${entityPlural}Repository.ts`
        )
    );

    // 5. Add container declaration
    // Verifica se já existe um arquivo  [module].containers.ts na pasta ./src/shared/containers
    const containersFile = path.join(
        "src",
        "shared",
        "containers",
        `${module}.containers.ts`
    );

    if (!fs.existsSync(containersFile)) {
        // Se o arquivo não existe, cria o arquivo
        writeFileIfNotExists(
            containersFile,
            `import { container } from "tsyringe";\n\n\n// EOF - used by CLI Generate Entity`
        );

        // Adiciona a importação do repositório no index.ts
        const indexFile = path.join("src", "shared", "containers", "index.ts");
        const indexFileContent = fs.readFileSync(indexFile, "utf-8");
        // replace the line `// End of imports - used by CLI Generate Entity` with the new import
        const newIndexFileContent = indexFileContent.replace(
            "// End of imports - used by CLI Generate Entity",
            `import "./${module}.containers";\n// End of imports - used by CLI Generate Entity`
        );
        fs.writeFileSync(indexFile, newIndexFileContent);
    }

    files.push(containersFile);

    // Adiciona a declaração do repositório no arquivo [module].containers.ts acima da linha `import { container } from "tsyringe";`
    const containersFileContent = fs.readFileSync(containersFile, "utf-8");
    const newContent = containersFileContent.replace(
        `import { container } from "tsyringe";`,
        `import { I${entityPlural}Repository } from "@modules/${module}/repositories/I${entityPlural}Repository";
        import { ${entityPlural}Repository } from "@modules/${module}/repositories/knex/${entityPlural}Repository";
        import { container } from "tsyringe";`
    );

    fs.writeFileSync(containersFile, newContent);

    // Adiciona a linha de registro do repositório no arquivo [module].containers.ts
    const containersFileContent2 = fs.readFileSync(containersFile, "utf-8");

    const newContent2 = containersFileContent2.replace(
        "// EOF - used by CLI Generate Entity",
        `// I${entityPlural}Repository
        container.registerSingleton<I${entityPlural}Repository>(\n    "${entityPlural}Repository",\n    ${entityPlural}Repository\n);\n// EOF - used by CLI Generate Entity\n`
    );
    fs.writeFileSync(containersFile, newContent2);

    console.log("Arquivos criados com sucesso!");

    runEslintOnFiles(files);
}

main();

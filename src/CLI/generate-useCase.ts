import { input, select } from "@inquirer/prompts";
import fs from "fs";
import Handlebars from "handlebars";
import path from "path";

import {
    ensureDir,
    lowerFirstLetter,
    pascalCase,
    runEslintOnFiles,
    writeFileIfNotExists,
} from "./utils";

Handlebars.registerHelper("ifEquals", function ifEquals(arg1, arg2, options) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});

// --- Funções utilitárias ---

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
        console.log("Módulos disponíveis:", modules);

        module = await select({
            message: "Selecione o módulo",
            choices: modules,
        });
    } else {
        // Verifica se o módulo existe
        const moduleExists = path.join("src/modules", module);
        if (!fs.existsSync(moduleExists)) {
            console.error(`Módulo ${module} não encontrado.`);
            return;
        }
    }

    const moduleDir = path.resolve("src/modules/", module);
    ensureDir(moduleDir);

    // lista entidades do módulo
    const entities = fs
        .readdirSync(path.join(moduleDir, "entities"))
        .map((file) => file.replace(".ts", ""));

    const entity: string = await select({
        message: "Qual a entidade?",
        choices: entities,
    });

    const entityLower = entity.toLowerCase();

    const entityPlural = await input({
        message: "Qual o nome da entidade no plural?",
        default: `${entity}s`,
    });

    // escolher qual o padrão de useCase [create, update, delete, list, getbypk]
    const useCase = await select({
        message: "Qual o padrão de useCase?",
        choices: [
            "create",
            "update",
            "delete",
            "listAll",
            "getByPK",
            "insertList",
        ],
    });

    let pkField = "";

    // Regex para pegar todas as linhas do tipo: palavra: tipo;
    // eslint-disable-next-line no-useless-escape
    const FIELD_REGEX = /^\s*(\w+):\s*([\w\[\]\|]+);/gm;

    const entityFile = path.join(moduleDir, "entities", `${entity}.ts`);
    const source = fs.readFileSync(entityFile, "utf8");

    const fields: { [key: string]: string } = {};
    let match: RegExpExecArray | null;
    match = FIELD_REGEX.exec(source);
    while (match) {
        // Ignora 'constructor' e outros métodos
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, name, type] = match;
        if (!["constructor"].includes(name)) {
            fields[name] = type;
        }
        match = FIELD_REGEX.exec(source);
    }

    // remove os campos updated_at e created_at
    delete fields.created_at;
    delete fields.updated_at;
    const firstField = Object.keys(fields)[0];

    // Pergunta o campo PK - first field as default
    if (useCase !== "listAll") {
        pkField = await input({
            message: "Qual o nome do campo PK?",
            default: firstField,
        });
    }

    const useCaseName = await input({
        message: "Qual o nome do useCase",
        default: `${useCase}${entity}`,
    });

    let pkParamName = "";
    let hasPkInParams = "Não";

    // caso update or delete, questiona se tem pk nos params
    if (useCase === "update" || useCase === "delete" || useCase === "getByPK") {
        if (useCase !== "getByPK") {
            hasPkInParams = await select({
                message: "Obter PK nos params?",
                choices: ["Sim", "Não"],
            });
        }

        pkParamName = await input({
            message: "Qual o nome do campo PK nos params?",
            default: firstField,
        });
    }

    const useCaseNamePascal = pascalCase(useCaseName);

    let useCaseDir = path.join(moduleDir, "useCases", module.toLowerCase());
    ensureDir(moduleDir);

    useCaseDir = path.join(useCaseDir, useCaseName);
    ensureDir(useCaseDir);

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

    // 1. UsesCases
    const useCaseTpl = compileTemplate(`${useCase}UseCase`);
    writeFileIfNotExists(
        path.join(useCaseDir, `${useCaseNamePascal}UseCase.ts`),
        useCaseTpl({
            module,
            modulePascal: pascalCase(module),
            entity,
            entityPlural,
            entityPluralLower: entityPlural.toLowerCase(),
            entity_pk: pkField,
            fields,
            entityLower,
            useCaseName,
            useCaseNamePascal,
        })
    );

    files.push(path.join(useCaseDir, `${useCaseNamePascal}UseCase.ts`));

    // 2. Controller
    const controllerTpl = compileTemplate(`${useCase}Controller`);
    writeFileIfNotExists(
        path.join(useCaseDir, `${useCaseNamePascal}Controller.ts`),
        controllerTpl({
            module,
            modulePascal: pascalCase(module),
            useCaseNamePascal,
            useCaseName,
            useCaseNameLowerFirst: lowerFirstLetter(useCaseName),
            entityLower,
            entityPlural,
            entityPluralLower: entityPlural.toLowerCase(),
            pkOnParams: hasPkInParams === "Sim",
            params_pk: pkParamName,
            entity_pk: pkField,
        })
    );

    files.push(path.join(useCaseDir, `${useCaseNamePascal}Controller.ts`));

    console.log("Arquivos criados com sucesso!");

    runEslintOnFiles(files);
}

main();

import { input, select } from "@inquirer/prompts";
import fs from "fs";
import Handlebars from "handlebars";
import path from "path";

Handlebars.registerHelper("ifEquals", function ifEquals(arg1, arg2, options) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});

// --- Funções utilitárias ---

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        console.log("Módulos disponíveis:", modules);

        module = await select({
            message: "Selecione o módulo",
            choices: modules,
        });
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

    console.log("Entidade escolhida:", entity);

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

    // Pergunta o campo PK - first field as default
    const firstField = Object.keys(fields)[0];
    const pkField = await input({
        message: "Qual o nome do campo PK?",
        default: firstField,
    });

    // escolher qual o padrão de useCase [create, update, delete, list, getbypk]
    const useCase = await select({
        message: "Qual o padrão de useCase?",
        choices: ["create", "update", "delete", "list", "getbypk"],
    });

    const useCaseName = await input({
        message: "Qual o nome do useCase",
        default: `${useCase}${entity}`,
    });

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

    // 1. UsesCases
    const useCaseTpl = compileTemplate(`${useCase}UseCase`);
    writeFileIfNotExists(
        path.join(useCaseDir, `${useCaseName}UseCase.ts`),
        useCaseTpl({
            entity,
            entity_pk: pkField,
            fields,
            entityLower,
        })
    );

    // 2. Controller
    const controllerTpl = compileTemplate(`${useCase}Controller`);
    writeFileIfNotExists(
        path.join(useCaseDir, `${useCaseName}Controller.ts`),
        controllerTpl({
            useCaseName,
            useCaseNameLowerFirst: lowerFirstLetter(useCaseName),
            entityLower,
        })
    );

    console.log("Arquivos criados com sucesso!");
}

main();

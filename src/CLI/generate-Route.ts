import { input, select } from "@inquirer/prompts";
import fs from "fs";
import Handlebars from "handlebars";
import path from "path";

import {
    lowerFirstLetter,
    runEslintOnFiles,
    writeFileIfNotExists,
    upperFirstLetter,
} from "./utils";

Handlebars.registerHelper("ifEquals", function ifEquals(arg1, arg2, options) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});

// --- Funções utilitárias ---

// --- CLI ---
async function main() {
    // 1. Pergunta o módulo
    let module = await input({
        message: "Para  qual do módulo? <ls - para listar>",
        default: "ls",
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
        const moduleExists = path.join("src", "modules", module);
        if (!fs.existsSync(moduleExists)) {
            console.error(`Módulo ${module} não encontrado.`);
            return;
        }
    }

    const moduleDir = path.join("src", "modules", module);

    const routesFile = path.join(
        "src",
        "shared",
        "http",
        "routes",
        `${module}.routes.ts`
    );

    // Verifica se módulo tem pasta de UseCases
    const useCasesDir = path.join(moduleDir, "useCases");
    if (!fs.existsSync(useCasesDir)) {
        console.error(`Módulo ${module} não tem pasta de UseCases.`);
        return;
    }

    // lista pastas dentro de useCases
    const entityUseCases = fs
        .readdirSync(useCasesDir)
        .filter((file) =>
            fs.statSync(path.join(useCasesDir, file)).isDirectory()
        );

    const entity: string = await select({
        message: "Qual a entidade?",
        choices: entityUseCases,
    });

    // lista useCases da entidade
    const useCases = fs
        .readdirSync(path.join(moduleDir, "useCases", entity))
        .filter((file) =>
            fs
                .statSync(path.join(moduleDir, "useCases", entity, file))
                .isDirectory()
        );

    const useCaseSel: string = await select({
        message: "Qual o useCase?",
        choices: useCases,
    });

    let param = "";
    // const useCaseName = `${upperFirstLetter(useCaseSel)}UseCase`;
    const controllerName = `${upperFirstLetter(useCaseSel)}Controller`;

    // check if controllers uses request.params
    const controllerFile = path.join(
        moduleDir,
        "useCases",
        entity,
        useCaseSel,
        `${controllerName}.ts`
    );
    if (!fs.existsSync(controllerFile)) {
        console.error(
            `Controller ${controllerName} não encontrado em ${controllerFile}.`
        );
        return;
    }
    const controllerContent = fs.readFileSync(controllerFile, "utf-8");
    if (controllerContent.includes("request.params")) {
        // obtem o param const { param } = request.params;
        const paramMatch = controllerContent.match(
            /const\s*{\s*(\w+)\s*}\s*=\s*request\.params\s*;?/
        );
        if (paramMatch) {
            param = paramMatch[0].split("=")[0].trim();
            param = param.replace("const ", "").trim();
            param = param.replace("{", "").trim();
            param = param.replace("}", "").trim();
            console.log(`Parâmetro encontrado: ${param}`);
        }
    }

    const httpMethod = await select({
        message: "Qual HTTP method?",
        choices: ["get", "post", "put", "delete", "patch"],
    });

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

    // Verifica se o arquivo de rotas do módulo ainda não existe
    if (!fs.existsSync(routesFile)) {
        const routeTPL = compileTemplate("moduleRoute");
        writeFileIfNotExists(
            path.join("src", "shared", "http", "routes", `${module}.routes.ts`),
            routeTPL({ module })
        );

        // Adiciona importação do módulo de rotas no arquivo principal de rotas
        const mainRouteFile = path.join(
            "src",
            "shared",
            "http",
            "routes",
            "index.ts"
        );

        const httpPath = await input({
            message: "Qual o path principal?",
            default: `/${entity.toLowerCase()}`,
        });

        // Adiciona a importação do repositório no index.ts
        const indexFileContent = fs.readFileSync(mainRouteFile, "utf-8");
        // replace the line `const router = Router();
        let newIndexFileContent = indexFileContent.replace(
            "\nconst router = Router();",
            `import { ${module}Routes } from "./${module}.routes";\nconst router = Router();`
        );

        newIndexFileContent = newIndexFileContent.replace(
            "export { router };",
            `router.use("${httpPath}",${module}Routes);\n\nexport { router };`
        );

        fs.writeFileSync(mainRouteFile, newIndexFileContent);
        files.push(mainRouteFile);
    }

    files.push(routesFile);

    // Importa o controller no arquivo de rotas
    const routeFileContent = fs.readFileSync(routesFile, "utf-8");
    let newRouteFileContent = routeFileContent.replace(
        `\nconst ${module}Routes = Router();`,
        `import { ${controllerName} } from "@modules/${module}/useCases/${entity}/${useCaseSel}/${controllerName}";\nconst ${module}Routes = Router();`
    );

    // Declara o controller no arquivo de rotas
    newRouteFileContent = newRouteFileContent.replace(
        `const ${module}Routes = Router();`,
        `const ${module}Routes = Router();\n\nconst ${lowerFirstLetter(
            controllerName
        )} = new ${controllerName}();`
    );

    let auxPath = entity.toLowerCase();
    if (auxPath === module.toLowerCase()) {
        auxPath = "";
    }

    // Caminho para armazenar subpaths usados
    const subpathsJsonPath = path.resolve(__dirname, "subpaths.json");
    let subpathsData: Record<string, string> = {};
    if (fs.existsSync(subpathsJsonPath)) {
        try {
            subpathsData = JSON.parse(
                fs.readFileSync(subpathsJsonPath, "utf-8")
            );
        } catch {
            subpathsData = {};
        }
    }
    const subpathKey = `${module}`;
    const defaultSubPath = subpathsData[subpathKey] || `/${auxPath}`;

    let httpSubPath = await input({
        message: "Qual o subpath? <informe com / no inicio>",
        default: defaultSubPath,
    });

    // check with regex if the subpath starts with /
    if (!/^\/.*/.test(httpSubPath)) {
        httpSubPath = `/${httpSubPath}`;
    }

    // Salva o subpath utilizado para o useCase selecionado
    subpathsData[subpathKey] = httpSubPath;
    fs.writeFileSync(subpathsJsonPath, JSON.stringify(subpathsData, null, 2));

    // if param is not empty, add it to the path
    httpSubPath = param ? `${httpSubPath}/:${param}` : httpSubPath;

    // check if // ${entityUseCase} exists in the file
    const regex = new RegExp(`// ${entity}`, "g");
    if (!newRouteFileContent.match(regex)) {
        newRouteFileContent = newRouteFileContent.replace(
            `\nexport { ${module}Routes };`,
            ` \n// ${entity}\n ${module}Routes.${httpMethod}("${httpSubPath}", ${lowerFirstLetter(
                controllerName
            )}.handle);\n\nexport { ${module}Routes };`
        );
    } else {
        newRouteFileContent = newRouteFileContent.replace(
            `// ${entity}`,
            `// ${entity}\n${module}Routes.${httpMethod}("${httpSubPath}", ${lowerFirstLetter(
                controllerName
            )}.handle);`
        );
    }

    fs.writeFileSync(routesFile, newRouteFileContent);
    console.log("Processo concluído!");

    runEslintOnFiles(files);
}

main();

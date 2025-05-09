import { exec } from "child_process";
import fs from "fs";

// Função para rodar o eslint --fix
export function runEslintOnFiles(files: string[]) {
    // Junta os paths em uma string e executa o comando
    const cmd = `yarn eslint ${files.map((f) => `"${f}"`).join(" ")} --fix`;
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao rodar ESLint: ${error.message}`);
            return;
        }
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function pascalCase(str: string) {
    return str.replace(/(^\w|_\w)/g, (m) => m.replace("_", "").toUpperCase());
}

export function upperFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function lowerFirstLetter(str: string) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

export function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function writeFileIfNotExists(filename: string, data: string) {
    if (!fs.existsSync(filename))
        fs.writeFileSync(filename, data, { flag: "wx" });
}

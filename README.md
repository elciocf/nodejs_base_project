# API Base

Este repositório contém a base de uma API construída com as seguintes tecnologias e ferramentas:

- **[Express](https://expressjs.com/)**: Framework minimalista para Node.js.
- **[TypeScript](https://www.typescriptlang.org/)**: Superset do JavaScript que adiciona tipagem estática.
- **[Knex.js](https://knexjs.org/)**: Query builder para SQL.
- **[ESLint](https://eslint.org/)**: Ferramenta para análise de código e padronização.
- **[Prettier](https://prettier.io/)**: Ferramenta para formatação de código.
- **[TSC Paths](https://github.com/dividab/tscpaths)**: Suporte para paths configurados no `tsconfig.json`.

## Scripts Disponíveis

No arquivo `package.json`, você encontrará os seguintes scripts úteis:

- `dev`: Inicia o servidor em modo de desenvolvimento com `ts-node-dev`.
- `build`: Compila o código TypeScript para JavaScript e ajusta os paths.
- `production`: Inicia o servidor em modo de produção com `pm2`.
- `initial-seeds`: Executa os seeds iniciais configurados no Knex.

## Configuração

1. Instale as dependências:
    ```bash
    npm install
    ```

2. Para executar em modo desenvolvimento
    ```bash
    npm run dev
    ```

Notas:
- Por padrão o servidor está configurado para porta 3000.
- Necessário informar os dados de conexão no arquivo `knex.ts` na pasta raiz e na pasta `/src/configs/knex.ts`.
- Ajuste o hash no arquivo `auth.ts`.


## Extensões Recomendadas para o VSCode

Para facilitar o desenvolvimento, instale as seguintes extensões no Visual Studio Code:

- **[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)**: Integração do ESLint com o VSCode.
- **[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)**: Formatação de código com Prettier.
- **[Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)**: Autocompletar caminhos de arquivos.
- **[DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)**: Suporte para arquivos `.env`.
- **[TypeScript Hero](https://marketplace.visualstudio.com/items?itemName=rbbit.typescript-hero)**: Ferramentas adicionais para TypeScript.

Certifique-se de configurar o `settings.json` do VSCode para habilitar o formatador padrão e o ESLint:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.format.enable": true
}
```




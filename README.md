# API Base

Este repositório contém a base de uma API, com padrão SOLID, construída com as seguintes tecnologias e ferramentas:

- **[Express](https://expressjs.com/)**: Framework minimalista para Node.js.
- **[TypeScript](https://www.typescriptlang.org/)**: Superset do JavaScript que adiciona tipagem estática.
- **[Knex.js](https://knexjs.org/)**: Query builder para SQL.
- **[ESLint](https://eslint.org/)**: Ferramenta para análise de código e padronização.
- **[Prettier](https://prettier.io/)**: Ferramenta para formatação de código.
- **[TSC Paths](https://github.com/dividab/tscpaths)**: Suporte para paths configurados no `tsconfig.json`.
- **[tsyringe](https://github.com/microsoft/tsyringe)**: Biblioteca para injeção de dependência em TypeScript.



Estão inclusos:
- `migrations`: do knex, para criar as tabelas de usuário, tipo de usuário e refresh_tokens.
- `Rotas`: signin, refresh_token
- `JSONWebToken`: Geração de tokens, refresh_tokens.
- `middleware`: Para validar a autenticação

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

2. Para executar o projeto é necessário que você tenha uma instância do mysql/mariadb
   Ajuste os arquivos para mirar na sua instância do banco de dados: 
   - knex.ts (na raiz do projeto)
   - Knex.ts (na pasta /src/configs)

3. Defina os hashs de token e refresh_token
   - auth.ts (na pasta /src/configs)

3. Execute as migrations:
    ```bash
    npm run knex -- migrate:latest
    ```
4. Execute os seeds iniciais:
    ```bash
    npm run initial-seeds
    ```  
5. Inicie o servidor em modo de desenvolvimento:
    ```bash
    npm run dev
    ```  

## Testes

Para testar as rotas da API, você pode utilizar as seguintes ferramentas:

1. **[Insomnia](https://insomnia.rest/)**: Uma ferramenta gráfica para testar APIs REST. Basta importar os endpoints manualmente ou criar um workspace para organizar suas requisições.

2. **Extensão [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)**: Utilize os arquivos da pasta `/http` para realizar testes diretamente no Visual Studio Code. Esses arquivos contêm exemplos de requisições HTTP que podem ser executados com a extensão.

### Como usar a extensão REST Client:

- Certifique-se de que a extensão está instalada no VSCode.
- Abra qualquer arquivo `.http` ou `.rest` na pasta `/http`.
- Clique no botão "Send Request" que aparece acima de cada requisição ou use o atalho `Ctrl+Alt+R` (ou `Cmd+Alt+R` no macOS).


Notas:
- Por padrão o servidor está configurado para porta 3000.



## Extensões Recomendadas para o VSCode

Para facilitar o desenvolvimento, instale as seguintes extensões no Visual Studio Code:

- **[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)**: Integração do ESLint com o VSCode.
- **[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)**: Formatação de código com Prettier.
- **[REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)**: Permite testar requisições HTTP diretamente no VSCode.


Certifique-se de configurar o `settings.json` do VSCode para habilitar o formatador padrão e o ESLint:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.format.enable": true
}
```




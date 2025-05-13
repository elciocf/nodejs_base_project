import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description:
                "Documentação da API gerada automaticamente pelo Swagger",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor de desenvolvimento",
            },
        ],
    },
    apis: ["./src/shared/http/routes/*.ts"], // Caminho para os arquivos de rotas
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec };

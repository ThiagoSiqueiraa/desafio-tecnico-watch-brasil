import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "API - Gerenciador de tarefas",
      version: "1.0.0",
      description: "Documentação dos endpoints (OpenAPI 3.0)",
    },
    servers: [{ url: "/" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },

    }
  },
  apis: ["./src/routes/*.ts"],
});

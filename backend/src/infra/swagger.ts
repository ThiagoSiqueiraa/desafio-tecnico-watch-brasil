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
      schemas: {
        TaskBase: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string", nullable: true },
            status: {
              type: "string",
              enum: ["pending", "in_progress", "completed"],
            },
            priority: { type: "string", enum: ["low", "medium", "high"] },
            dueDate: { type: "string", format: "date-time" },
          },
          required: ["projectId", "title", "status", "priority", "dueDate"],
        },
        TaskList: {
          allOf: [
            { $ref: "#/components/schemas/TaskBase" },
            {
              type: "object",
              properties: {
                id: { type: "integer", readOnly: true },
                createdAt: {
                  type: "string",
                  format: "date-time",
                  readOnly: true,
                },
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  readOnly: true,
                },
                completedSubtasks: {
                  type: "integer",
                  readOnly: true,
                },
                totalSubtasks: {
                  type: "integer",
                  readOnly: true,
                },
              },
              required: ["id", "createdAt", "updatedAt"],
            },
          ],
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
});

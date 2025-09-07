// src/data-source.ts
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Project } from "./entities/Project";
import { TaskChecklist } from "./entities/TaskChecklist";
import { Task } from "./entities/Task";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "postgres",
  password: "123456",
  database: "app",
  synchronize: false,
  entities: [User, Project, Task, TaskChecklist],
  logging: true,
  logger: "advanced-console",
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

// src/data-source.ts
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Project } from "./entities/Project";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "postgres",
  password: "123456",
  database: "app",
  synchronize: false,
  entities: [User, Project],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

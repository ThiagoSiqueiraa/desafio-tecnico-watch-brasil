// src/entities/Project.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ schema: "app", name: "projects" })
export class Project {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id!: string;

  @Column("text")
  name!: string;
}

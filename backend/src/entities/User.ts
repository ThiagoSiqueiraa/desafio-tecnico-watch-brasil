import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Project } from "./Project";

@Entity({ schema: "app", name: "users" })
export class User {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id!: string;

  @Column("text")
  name!: string;

  @Column("text", { unique: true })
  email!: string;

  @Column("text", { select: false })
  password!: string;

  @ManyToOne(() => Project, { nullable: true })
  @JoinColumn({ name: "current_project_id" })
  currentProject?: Project | null;
}

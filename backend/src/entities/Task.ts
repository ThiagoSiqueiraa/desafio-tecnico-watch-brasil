import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { Project } from "./Project";

@Entity({ schema: "app", name: "tasks" })
export class Task {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id!: string;

  @ManyToOne(() => Project, { nullable: false })
  @JoinColumn({ name: "project_id" })
  project!: Project;

  @Column("text")
  title!: string;

  @Column("text", { nullable: true })
  description?: string | null;

  @Column("text")
  status!: string;

  @Column("int")
  priority!: number;

  @Column("timestamp", { nullable: true })
  due_date?: Date | null;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updated_at!: Date;

  @DeleteDateColumn({ type: "timestamp", name: "deleted_at" })
  deleted_at?: Date | null;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from "typeorm";
import { Project } from "./Project";
import { TaskChecklist } from "./TaskChecklist";

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

  @Column("timestamp", { nullable: true, name: "due_date" })
  dueDate?: Date | null;

  @OneToMany(() => TaskChecklist, (checklist) => checklist.task)
  checklists!: TaskChecklist[];

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt!: Date;

  @DeleteDateColumn({ type: "timestamp", name: "deleted_at" })
  deletedAt?: Date | null;
}

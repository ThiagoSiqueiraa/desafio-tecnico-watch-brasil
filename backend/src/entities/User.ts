import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Project } from "./Project";
import { ProjectMember } from "./ProjectMember";

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

  @OneToMany(() => Project, (project) => project.ownerUser)
  ownedProjects!: Project[];

  // memberships do usuário
  @OneToMany(() => ProjectMember, (pm) => pm.user)
  projectMemberships!: ProjectMember[];
}

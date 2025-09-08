// ProjectMember.ts
import { Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Project } from "./Project";
import { User } from "./User";

@Entity({ name: "projects_members", schema: "app" })
export class ProjectMember {
  // Torna as FKs parte da PK composta com { primary: true }

  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id!: number;

  @RelationId((pm: ProjectMember) => pm.project)
  projectId!: string;

  @RelationId((pm: ProjectMember) => pm.user)
  userId!: string;

  @ManyToOne(() => Project, (project) => project.members, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "project_id" })
  project!: Project;

  @ManyToOne(() => User, (user) => user.projectMemberships, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;
}

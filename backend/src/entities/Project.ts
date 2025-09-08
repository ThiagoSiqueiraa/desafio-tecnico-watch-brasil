import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { ProjectMember } from "./ProjectMember";

@Entity({ schema: "app", name: "projects" })
export class Project {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id!: number;

  @Column("text")
  name!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "owner_user_id" })
  ownerUser!: User;

  @OneToMany(() => ProjectMember, (pm) => pm.project)
  members!: ProjectMember[];

  
}

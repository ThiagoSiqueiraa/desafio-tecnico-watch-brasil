import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { User } from "./User";

@Entity({ schema: "app", name: "projects" })
export class Project {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id!: string;

  @Column("text")
  name!: string;



  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: "owner_user_id" })
  ownerUser!: User;
}

import {
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Entity,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

// extending BaseEntity allows us to do things like User.create({})
@Entity()
export class Agency extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") id: string;

  @Column("varchar", { length: 255, unique: true })
  name: string;

  // the string is the typescript type of it
  @Column("varchar", { length: 255 })
  emailHost: string;

  @CreateDateColumn()
  createdDate: Date;

  @OneToMany(() => User, (user) => user.agency)
  users: Array<User>;
}

// insert into agency (name,"emailHost") values('ATO','@ato.gov.au');

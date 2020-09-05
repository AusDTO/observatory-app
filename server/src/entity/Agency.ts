import {
  Column,
  BaseEntity,
  CreateDateColumn,
  Entity,
  OneToMany,
  BeforeInsert,
  PrimaryColumn,
} from "typeorm";
import { User } from "./User";
import { v4 as uuid } from "uuid";

// extending BaseEntity allows us to do things like User.create({})
@Entity()
export class Agency extends BaseEntity {
  @PrimaryColumn("uuid") id: string;

  @Column("varchar", { length: 255, unique: true })
  name: string;

  // the string is the typescript type of it
  @Column("varchar", { length: 255 })
  emailHost: string;

  @CreateDateColumn()
  createdDate: Date;

  @OneToMany(() => User, (user) => user.agency)
  users: Array<User>;

  @BeforeInsert()
  addId() {
    this.id = uuid();
  }
}

// insert into agency (name,"emailHost") values('ATO','@ato.gov.au');

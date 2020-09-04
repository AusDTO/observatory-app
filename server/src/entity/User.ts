import {
  Entity,
  Column,
  BeforeInsert,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from "typeorm";
import * as bcrypt from "bcryptjs";
import { Agency } from "./Agency";
import { v4 as uuid } from "uuid";

// extending BaseEntity allows us to do things like User.create({})
@Entity("users")
export class User extends BaseEntity {
  @PrimaryColumn("uuid") id: string;

  @Column("varchar", { length: 255 })
  name: string;

  // the string is the typescript type of it
  @Column("varchar", { length: 255 })
  email: string;

  @Column("text")
  password: string;

  @Column("boolean", { default: false })
  verified: boolean;

  @Column("varchar", { length: 255 })
  role: string;

  // Many users belong to one agency
  @ManyToOne(() => Agency, (agency: Agency) => agency.users)
  @JoinColumn({ name: "agency_id" })
  agency: Agency;

  @CreateDateColumn()
  createdDate: Date;

  // type orm decorator. This function calls right before this object is inserted into database
  @BeforeInsert()
  async hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  @BeforeInsert()
  addId() {
    this.id = uuid();
  }
}

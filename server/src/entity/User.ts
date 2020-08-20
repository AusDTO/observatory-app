import {
  Entity,
  Column,
  BeforeInsert,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BeforeUpdate,
  AfterUpdate,
  ManyToOne,
} from "typeorm";
import * as bcrypt from "bcrypt";
import { Agency } from "./Agency";

// extending BaseEntity allows us to do things like User.create({})
@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") id: string;

  @Column("varchar", { length: 255 })
  name: string;

  // the string is the typescript type of it
  @Column("varchar", { length: 255 })
  email: string;

  @Column("text")
  password: string;

  @Column("text")
  agency: string;

  @Column("boolean", { default: false })
  verified: boolean;

  @Column("boolean", { default: false })
  locked: boolean;

  @Column("varchar", { length: 255 })
  role: string;

  @ManyToOne((_type) => Agency, (agency) => agency.id)
  agency_code: Agency;

  @CreateDateColumn()
  createdDate: Date;

  // type orm decorator. This function calls right before this object is inserted into database
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}

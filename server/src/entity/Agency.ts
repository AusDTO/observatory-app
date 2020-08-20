import {
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Entity,
} from "typeorm";

// extending BaseEntity allows us to do things like User.create({})
@Entity()
export class Agency extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") id: string;

  @Column("varchar", { length: 255 })
  name: string;

  // the string is the typescript type of it
  @Column("varchar", { length: 255 })
  emailHost: string;

  @CreateDateColumn()
  createdDate: Date;
}

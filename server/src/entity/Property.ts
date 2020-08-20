import {
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Entity,
  ManyToOne,
} from "typeorm";
import { Agency } from "./Agency";

// extending BaseEntity allows us to do things like User.create({})
@Entity()
export class Property extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") id: string;

  @Column("varchar", { length: 255, unique: true })
  ua_id: string;

  @Column("varchar", { length: 255 })
  domain: string;

  @Column("varchar", { length: 255 })
  service_name: string;

  @ManyToOne((_type) => Agency, (agency) => agency.id)
  agency_code: Agency;

  @CreateDateColumn()
  createdDate: Date;
}

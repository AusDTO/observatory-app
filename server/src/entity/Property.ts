import {
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
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

  @Column("varchar", { length: 255, nullable: true })
  service_name: string;

  // Many properties belong to one agency
  @ManyToOne((_type) => Agency, (agency) => agency.id)
  @JoinColumn({ name: "agency_id" })
  agency: Agency;

  @CreateDateColumn()
  createdDate: Date;
}

// insert into property ("ua_id","domain", "service_name","agency_id") values('UAID-12345','www.fake.gov.au','fake service','227da47e-cc53-472a-9e67-8fee3ec2c157');

// insert into property ("ua_id","domain", "service_name","agency_id") values('UAID-543221','www.bla.gov.au','bla service','227da47e-cc53-472a-9e67-8fee3ec2c157');

// insert into property ("ua_id","domain", "service_name","agency_id") values('UAID-1234567','www.hello.gov.au','hello service','227da47e-cc53-472a-9e67-8fee3ec2c157');

// insert into property ("ua_id","domain", "service_name","agency_id") values('UAID-12345342','www.basketbll.gov.au','basketball service','227da47e-cc53-472a-9e67-8fee3ec2c157');

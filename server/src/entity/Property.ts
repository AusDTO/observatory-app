import {
  Column,
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  BeforeInsert,
  OneToMany,
} from "typeorm";
import { Agency } from "./Agency";
import { v4 as uuid } from "uuid";
import { Outputs } from "./Output";

// extending BaseEntity allows us to do things like User.create({})
@Entity()
export class Property extends BaseEntity {
  @PrimaryColumn("uuid") id: string;

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

  @OneToMany((type) => Outputs, (output) => output.property)
  outputs: Outputs[];

  @CreateDateColumn()
  createdDate: Date;

  @BeforeInsert()
  addId() {
    this.id = uuid();
  }

  @BeforeInsert()
  async lowercaseEmail() {
    this.ua_id = this.ua_id.toLowerCase();
  }
}
// insert into property ("ua_id","domain", "service_name","agency_id") values('UAID-12345','www.designsystem.gov.au','Design system','227da47e-cc53-472a-9e67-8fee3ec2c157');

// insert into property ("id","ua_id","domain", "service_name","agency_id") values('5a1431df-c573-4a2e-a1d9-2ffe9930ccaf','UAID-543221','www.observatory.service.gov.au','Observatory website','53e8f767-ede3-4f88-b3a2-d97eadc9178a');

// insert into property ("id","ua_id","domain", "service_name","agency_id") values('e6f88668-743c-4fe4-bf56-0c94641d0634','UAID-1234567','www.dta.gov.au','Dta webiste','53e8f767-ede3-4f88-b3a2-d97eadc9178a');

// insert into property ("id","ua_id","domain", "service_name","agency_id") values('9dd8b05d-92f9-4627-a7e1-be9cb6cf3072','UAID-12345342','www.data.gov.au','Data gov au','553ad9f9-eef8-4d84-af02-7c59655bda09');

// insert into property ("ua_id","domain", "service_name","agency_id") values('UAID-123453242','www.ato.gov.au','ATO website','9dd8b05d-92f9-4627-a7e1-be9cb6cf3072');

// insert into property ("ua_id","domain", "service_name","agency_id") values('UAID-98734534','www.business.gov.au','Business gov au website','9dd8b05d-92f9-4627-a7e1-be9cb6cf3072');

// insert into property ("ua_id","domain", "service_name","agency_id") values('UAID-9873234534','www.beta.ato.gov.au','Tax website beta','9dd8b05d-92f9-4627-a7e1-be9cb6cf3072');

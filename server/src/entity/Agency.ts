import {
  Column,
  BaseEntity,
  CreateDateColumn,
  Entity,
  OneToMany,
  BeforeInsert,
  PrimaryColumn,
  AfterInsert,
  getRepository,
} from "typeorm";
import { User } from "./User";
import { v4 as uuid } from "uuid";

// extending BaseEntity allows us to do things like User.create({})
@Entity()
export class Agency extends BaseEntity {
  @PrimaryColumn("uuid") id: string;

  @Column("varchar", { length: 255, unique: true })
  name: string;

  @CreateDateColumn()
  createdDate: Date;

  @Column("simple-array")
  emailHosts: string[];

  @OneToMany(() => User, (user) => user.agency)
  users: Array<User>;

  @BeforeInsert()
  addId() {
    this.id = uuid();
  }

  @AfterInsert()
  async addToUsers() {
    const users = await getRepository(User)
      .createQueryBuilder("user")
      .where("user.emailHost IN (:...emailHosts)", {
        emailHosts: this.emailHosts,
      })
      .getMany();

    if (users) {
      users.forEach(async (user) => {
        if (!user.agency) {
          user.agency = this;
          await User.save(user);
        }
      });
    }
  }
}

// insert into agency (id, name,"emailHosts") values('97570478-028c-4068-8af1-6c55006d5fb4','ATO',ARRAY ['@digital.gov.au','@test.gov.au']);

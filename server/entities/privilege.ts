import { Domain } from '@things-factory/domain-base'
import { Field, ID, ObjectType, InputType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Role } from './role'
import { User } from './user'

@InputType('PrivilegeInput')
@ObjectType()
@Entity('privileges')
@Index('ix_privilege_0', (privilege: Privilege) => [privilege.domain, privilege.name, privilege.category], {
  unique: true
})
export class Privilege extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field(type => Domain)
  @ManyToOne(type => Domain)
  domain: Domain

  @Field()
  @Column()
  name: string

  @Field()
  @Column()
  category: string

  @Field()
  @Column({ nullable: true })
  description?: string

  @Field(type => [Role])
  @ManyToMany(type => Role, role => role.privileges)
  roles: Role[]

  @Field(type => User, { nullable: true })
  @ManyToOne(type => User, { nullable: true })
  creator?: User

  @Field(type => User, { nullable: true })
  @ManyToOne(type => User, { nullable: true })
  updater?: User

  @Field(type => Date)
  @CreateDateColumn()
  createdAt: Date

  @Field(type => Date)
  @UpdateDateColumn()
  updatedAt: Date
}

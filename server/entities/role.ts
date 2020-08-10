import { Domain } from '@things-factory/domain-base'
import { Field, ID, ObjectType, InputType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Privilege } from './privilege'
import { User } from './user'

@InputType('RoleInput')
@ObjectType()
@Entity('roles')
@Index('ix_role_0', (role: Role) => [role.domain, role.name], { unique: true })
export class Role extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field(type => Domain)
  @ManyToOne(type => Domain)
  domain: Domain

  @Field()
  @Column()
  name: string

  @Field(type => [User])
  @ManyToMany(type => User, user => user.roles)
  users: User[]

  @Field(type => [Privilege])
  @ManyToMany(type => Privilege, privilege => privilege.roles)
  @JoinTable({ name: 'roles_privileges' })
  privileges: Privilege[]

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string

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

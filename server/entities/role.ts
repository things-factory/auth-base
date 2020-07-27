import { Domain } from '@things-factory/domain-base'
import {
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
import { Priviledge } from './priviledge'
import { User } from './user'
import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
@Entity('roles')
@Index('ix_role_0', (role: Role) => [role.domain, role.name], { unique: true })
export class Role {
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

  @Field(type => [Priviledge])
  @ManyToMany(type => Priviledge, priviledge => priviledge.roles)
  @JoinTable({ name: 'roles_priviledges' })
  priviledges: Priviledge[]

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

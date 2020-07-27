import { Domain } from '@things-factory/domain-base'
import { Field, ID, ObjectType } from 'type-graphql'
import {
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

@ObjectType()
@Entity('priviledges')
@Index('ix_priviledge_0', (priviledge: Priviledge) => [priviledge.domain, priviledge.name, priviledge.category], {
  unique: true
})
export class Priviledge {
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
  @ManyToMany(type => Role, role => role.priviledges)
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

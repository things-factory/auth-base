import { Domain } from '@things-factory/domain-base'
import { Field, ID, ObjectType } from 'type-graphql'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity
} from 'typeorm'
import { User } from './user'

@ObjectType()
@Entity()
@Index('ix_user_histories_0', (userHistory: UserHistory) => [userHistory.domain, userHistory.id], { unique: true })
export class UserHistory extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field(type => Domain)
  @ManyToOne(type => Domain)
  domain: Domain

  @Field(type => User, { nullable: true })
  @ManyToOne(type => User, { nullable: true })
  userAccount?: User

  @Field({ nullable: true })
  @Column({ nullable: true })
  status?: string

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

import { Domain } from '@things-factory/domain-base'
import { Field, ID, ObjectType, InputType } from 'type-graphql'
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
@Index('ix_permit_url_0', (permitUrl: PermitUrl) => [permitUrl.domain, permitUrl.name], { unique: true })
export class PermitUrl extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field(type => Domain)
  @ManyToOne(type => Domain)
  domain: Domain

  @Field()
  @Column()
  name: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string

  @Field()
  @Column()
  type: string

  @Field({ nullable: true, defaultValue: false })
  @Column({
    nullable: true,
    default: false
  })
  active?: boolean

  @Field(type => User, { nullable: true })
  @ManyToOne(type => User, { nullable: true })
  creator?: User

  @Field(type => User, { nullable: true })
  @ManyToOne(type => User, { nullable: true })
  updater?: User

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date
}

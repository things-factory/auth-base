import { Domain } from '@things-factory/domain-base'
import { Field, ID, ObjectType } from 'type-graphql'
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './user'

@ObjectType()
@Entity('appliances')
@Index('ix_appliance_0', (appliance: Appliance) => [appliance.domain, appliance.name, appliance.applianceId], {
  unique: true
})
export class Appliance {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field(type => Domain)
  @ManyToOne(type => Domain)
  domain: Domain

  @Field()
  @Column()
  applianceId: string

  @Field()
  @Column()
  name: string

  @Field()
  @Column()
  brand: string

  @Field()
  @Column()
  model: string

  @Field()
  @Column()
  type: string

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

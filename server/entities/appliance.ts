import { Domain } from '@things-factory/shell'
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './user'

@Entity('appliances')
@Index('ix_appliance_0', (appliance: Appliance) => [appliance.domain, appliance.name, appliance.applianceId], {
  unique: true
})
export class Appliance {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column('text')
  applianceId: string

  @Column('text')
  name: string

  @Column('text')
  brand: string

  @Column('text')
  model: string

  @Column('text')
  type: string

  @Column('text', {
    nullable: true
  })
  description: string

  @ManyToOne(type => User, {
    nullable: true
  })
  creator: User

  @ManyToOne(type => User, {
    nullable: true
  })
  updater: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

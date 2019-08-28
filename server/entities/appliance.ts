import { Domain } from '@things-factory/shell'
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './user'

@Entity('appliances')
@Index('ix_appliance_0', (appliance: Appliance) => [appliance.domain, appliance.name, appliance.applianceId], {
  unique: true
})
export class Appliance {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @ManyToOne(type => Domain)
  domain: Domain

  @Column()
  applianceId: string

  @Column()
  name: string

  @Column()
  brand: string

  @Column()
  model: string

  @Column()
  type: string

  @Column({
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

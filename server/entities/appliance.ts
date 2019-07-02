import { Domain, DomainBaseEntity } from '@things-factory/shell'
import { Column, Entity, Index, ManyToOne } from 'typeorm'
import { User } from './user'

@Entity('appliances')
@Index('ix_appliance_0', (appliance: Appliance) => [appliance.domain, appliance.name, appliance.applianceId], {
  unique: true
})
export class Appliance extends DomainBaseEntity {
  @Column('text')
  applianceId: string

  @ManyToOne(type => Domain)
  domain: Domain

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

  @ManyToOne(type => User)
  creator: User

  @ManyToOne(type => User)
  updater: User
}

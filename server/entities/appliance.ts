import { Entity, Index, Column, ManyToOne } from 'typeorm'
import { Domain, DomainBaseEntity } from '@things-factory/shell'

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
}

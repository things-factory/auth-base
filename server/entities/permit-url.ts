import { DomainBaseEntity, Domain } from '@things-factory/shell'
import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

@Entity('permit-urls')
@Index('ix_permit_url_0', (permitUrl: PermitUrl) => [permitUrl.domain, permitUrl.name], { unique: true })
export class PermitUrl extends DomainBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column('text')
  name: string

  @Column('text', {
    nullable: true
  })
  description: string

  @Column('text')
  type: string

  @Column('boolean', {
    nullable: true,
    default: false
  })
  active: boolean
}

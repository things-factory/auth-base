import { Domain, DomainBaseEntity } from '@things-factory/shell'
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user'

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

  @ManyToOne(type => User)
  creator: User

  @ManyToOne(type => User)
  updater: User
}

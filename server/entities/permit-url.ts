import { Domain } from '@things-factory/shell'
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './user'

@Entity('permit-urls')
@Index('ix_permit_url_0', (permitUrl: PermitUrl) => [permitUrl.domain, permitUrl.name], { unique: true })
export class PermitUrl {
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

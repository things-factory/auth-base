import { Domain, DomainBaseEntity } from '@things-factory/shell'
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Role } from './role'
import { User } from './user'

@Entity('priviledges')
@Index('ix_priviledge_0', (priviledge: Priviledge) => [priviledge.domain, priviledge.name], { unique: true })
export class Priviledge extends DomainBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column('text')
  name: string

  @ManyToOne(type => Role, role => role.priviledge)
  role: Role

  @Column('text')
  category: string

  @Column('text', {
    nullable: true
  })
  description: string

  @ManyToOne(type => User)
  creator: User

  @ManyToOne(type => User)
  updater: User
}

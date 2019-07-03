import { Domain, DomainBaseEntity } from '@things-factory/shell'
import { Column, Entity, Index, ManyToOne, ManyToMany } from 'typeorm'
import { Role } from './role'
import { User } from './user'

@Entity('priviledges')
@Index('ix_priviledge_0', (priviledge: Priviledge) => [priviledge.domain, priviledge.name], { unique: true })
export class Priviledge extends DomainBaseEntity {
  @ManyToOne(type => Domain)
  domain: Domain

  @Column('text')
  name: string

  @Column('text')
  category: string

  @Column('text', {
    nullable: true
  })
  description: string

  @ManyToMany(type => Role, role => role.priviledges)
  roles: Role[]

  @ManyToOne(type => User)
  creator: User

  @ManyToOne(type => User)
  updater: User
}

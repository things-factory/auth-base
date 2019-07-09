import { Domain, DomainBaseEntity } from '@things-factory/shell'
import { Column, Entity, Index, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinTable } from 'typeorm'
import { Priviledge } from './priviledge'
import { User } from './user'

@Entity('roles')
@Index('ix_role_0', (role: Role) => [role.domain, role.name], { unique: true })
export class Role extends DomainBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: String

  @ManyToOne(type => Domain)
  domain: Domain

  @Column('text')
  name: string

  @ManyToMany(type => User, user => user.roles)
  users: User[]

  @ManyToMany(type => Priviledge, priviledge => priviledge.roles)
  @JoinTable({ name: 'roles-priviledges' })
  priviledges: Priviledge[]

  @Column('text', {
    nullable: true
  })
  description: string

  @ManyToOne(type => User)
  creator: User

  @ManyToOne(type => User)
  updater: User
}

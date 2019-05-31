import { Domain, DomainBaseEntity } from '@things-factory/shell'
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm'
import { User } from './user'
import { Priviledge } from './priviledge'

@Entity('roles')
@Index('ix_role_0', (role: Role) => [role.domain, role.name], { unique: true })
export class Role extends DomainBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column('text')
  name: string

  @ManyToMany(type => User, user => user.role)
  users: User[]

  @OneToMany(type => Priviledge, priviledge => priviledge.role)
  priviledge: Priviledge[]

  @Column('text', {
    nullable: true
  })
  description: string
}

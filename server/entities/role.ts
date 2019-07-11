import { Domain } from '@things-factory/shell'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Priviledge } from './priviledge'
import { User } from './user'

@Entity('roles')
@Index('ix_role_0', (role: Role) => [role.domain, role.name], { unique: true })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: String

  @ManyToOne(type => Domain)
  domain: Domain

  @Column()
  name: string

  @ManyToMany(type => User, user => user.roles)
  users: User[]

  @ManyToMany(type => Priviledge, priviledge => priviledge.roles)
  @JoinTable({ name: 'roles_priviledges' })
  priviledges: Priviledge[]

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

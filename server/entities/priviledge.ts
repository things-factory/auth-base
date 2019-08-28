import { Domain } from '@things-factory/shell'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Role } from './role'
import { User } from './user'

@Entity('priviledges')
@Index('ix_priviledge_0', (priviledge: Priviledge) => [priviledge.domain, priviledge.name, priviledge.category], {
  unique: true
})
export class Priviledge {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @ManyToOne(type => Domain)
  domain: Domain

  @Column()
  name: string

  @Column()
  category: string

  @Column({
    nullable: true
  })
  description: string

  @ManyToMany(type => Role, role => role.priviledges)
  roles: Role[]

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

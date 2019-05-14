import { Domain, DomainBaseEntity } from '@things-factory/shell'
import { Column, Entity, Index, ManyToOne } from 'typeorm'

@Entity('users-roles')
@Index('ix_users_role_0', (usersRole: UsersRole) => [usersRole.userId, usersRole.roleId], { unique: true })
@Index('ix_users_role_1', (usersRole: UsersRole) => [usersRole.roleId, usersRole.userId])
@Index('ix_users_role_2', (usersRole: UsersRole) => [usersRole.domain])
export class UsersRole extends DomainBaseEntity {
  @ManyToOne(type => Domain)
  domain: Domain

  @Column('text')
  id: string

  @Column('text')
  userId: string

  @Column('text')
  roleId: string
}

import { Domain, DomainBaseEntity } from '@things-factory/shell'
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('user-role-histories')
@Index('ix_user_role_histories_0', (userRoleHistory: UserRoleHistory) => [userRoleHistory.domain, userRoleHistory.id], {
  unique: true
})
export class UserRoleHistory extends DomainBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column('text', {
    nullable: true
  })
  userAccountId: string

  @Column('text', {
    nullable: true
  })
  roleId: string

  @Column('text', {
    nullable: true
  })
  status: string
}

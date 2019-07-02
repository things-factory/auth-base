import { Domain, DomainBaseEntity } from '@things-factory/shell'
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user'

@Entity('user-histories')
@Index('ix_user_histories_0', (userHistory: UserHistory) => [userHistory.domain, userHistory.id], { unique: true })
export class UserHistory extends DomainBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column('text', {
    nullable: true
  })
  userAccountId: string

  @ManyToOne(type => User)
  userAccount: User

  @Column('text', {
    nullable: true
  })
  status: string

  @ManyToOne(type => User)
  creator: User

  @ManyToOne(type => User)
  updater: User
}

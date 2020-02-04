import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './user'

@Entity('users_tokens')
@Index('ix_users_tokens_0', (usersTokens: UsersTokens) => [usersTokens.user, usersTokens.token], {
  unique: true
})
export class UsersTokens {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => User)
  user: User

  @Column({
    nullable: false
  })
  token: string

  @Column()
  expiresAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

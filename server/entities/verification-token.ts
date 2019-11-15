import { Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm'

@Entity('verification_tokens')
export class VerificationToken {
  @PrimaryColumn()
  userId: string

  @Column({
    nullable: false
  })
  token: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

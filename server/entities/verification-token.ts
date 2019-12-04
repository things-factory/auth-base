import { Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { config } from '@things-factory/env'
const ORMCONFIG = config.get('ormconfig', {})
const DATABASE_TYPE = ORMCONFIG.type

export enum VerificationTokenType {
  ACTIVATION = 'activation',
  PASSWORD_RESET = 'password-reset'
}

@Entity('verification_tokens')
export class VerificationToken {
  @PrimaryColumn()
  userId: string

  @Column({
    nullable: false
  })
  token: string

  @Column({
    nullable: false,
    type: DATABASE_TYPE == 'postgres' || DATABASE_TYPE == 'mysql' || DATABASE_TYPE == 'mariadb' ? 'enum' : 'smallint',
    enum: VerificationTokenType,
    default: VerificationTokenType.ACTIVATION
  })
  type: VerificationTokenType

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

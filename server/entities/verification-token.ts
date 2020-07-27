import { config } from '@things-factory/env'
import { Field, ObjectType } from 'type-graphql'
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'
const ORMCONFIG = config.get('ormconfig', {})
const DATABASE_TYPE = ORMCONFIG.type

export enum VerificationTokenType {
  ACTIVATION = 'activation',
  PASSWORD_RESET = 'password-reset',
  UNLOCK = 'unlock'
}

@ObjectType()
@Entity('verification_tokens')
export class VerificationToken {
  @Field()
  @PrimaryColumn()
  userId: string

  @Field({ nullable: true })
  @Column({ nullable: false })
  token?: string

  @Field({ nullable: true, defaultValue: VerificationTokenType.ACTIVATION })
  @Column({
    nullable: false,
    type: DATABASE_TYPE == 'postgres' || DATABASE_TYPE == 'mysql' || DATABASE_TYPE == 'mariadb' ? 'enum' : 'smallint',
    enum: VerificationTokenType,
    default: VerificationTokenType.ACTIVATION
  })
  type: VerificationTokenType

  @Field(type => Date)
  @CreateDateColumn()
  createdAt: Date

  @Field(type => Date)
  @UpdateDateColumn()
  updatedAt: Date
}

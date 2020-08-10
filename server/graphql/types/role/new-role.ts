import { Field, InputType } from 'type-graphql'
import { Role, User, Privilege } from '../../../entities'
import { Domain } from '@things-factory/domain-base'

@InputType()
export class NewRole extends Role {
  @Field(type => Domain)
  domain: Domain
  @Field()
  name: string
  @Field(type => [User])
  users: User[]
  @Field(type => [Privilege])
  privileges: Privilege[]
  @Field({ nullable: true })
  description?: string
}

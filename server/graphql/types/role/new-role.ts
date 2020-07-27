import { Field, InputType } from 'type-graphql'
import { Role, User, Priviledge } from '../../../entities'
import { Domain } from '@things-factory/domain-base'

@InputType()
export class NewRole extends Role {
  @Field(type => Domain)
  domain: Domain
  @Field()
  name: string
  @Field(type => [User])
  users: User[]
  @Field(type => [Priviledge])
  priviledges: Priviledge[]
  @Field({ nullable: true })
  description?: string
}

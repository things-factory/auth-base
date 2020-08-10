import { Field, InputType } from 'type-graphql'
import { User, Role } from '../../../entities'
import { Domain } from '@things-factory/domain-base'
import { Partial } from '@things-factory/graphql-utils'

@InputType()
export class NewUser extends Partial(User) {
  @Field()
  name: string
  @Field(type => Domain, { nullable: true })
  domain?: Domain
  @Field(type => [Domain], { nullable: true })
  domains?: [Domain]
  @Field({ nullable: true })
  description?: string
  @Field()
  email: string
  @Field()
  password: string
  @Field(type => [Role], { nullable: true })
  roles?: Role[]
  @Field({ nullable: true })
  userType?: string
}

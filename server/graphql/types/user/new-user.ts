import { Field, InputType } from 'type-graphql'
import { User, Role } from '../../../entities'
import { Domain } from '@things-factory/domain-base'

@InputType()
export class NewUser implements Partial<User> {
  @Field()
  name: string
  @Field(type => Domain, { nullable: true })
  domain?: Promise<Domain>
  @Field(type => [Domain], { nullable: true })
  domains?: Promise<[Domain]>
  @Field({ nullable: true })
  description?: string
  @Field()
  email: string
  @Field()
  password: string
  @Field(type => [Role])
  roles: Role[]
  @Field({ nullable: true })
  userType?: string
}

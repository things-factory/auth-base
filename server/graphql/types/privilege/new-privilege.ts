import { Field, InputType } from 'type-graphql'
import { Privilege, Role } from '../../../entities'

@InputType()
export class NewPrivilege extends Privilege {
  @Field()
  name: string
  @Field()
  category: string
  @Field({ nullable: true })
  description?: string
  @Field(type => [Role])
  roles: Role[]
}

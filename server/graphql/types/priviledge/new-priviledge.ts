import { Field, InputType } from 'type-graphql'
import { Priviledge, Role } from '../../../entities'

@InputType()
export class NewPriviledge extends Priviledge {
  @Field()
  name: string
  @Field()
  category: string
  @Field({ nullable: true })
  description?: string
  @Field(type => [Role])
  roles: Role[]
}

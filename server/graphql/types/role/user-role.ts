import { Field, InputType } from 'type-graphql'
import { PermitUrl, User, Role } from '../../../entities'

@InputType()
export class UserRole implements Partial<User>, Partial<Role> {
  @Field()
  name: string
  @Field({ nullable: true })
  description?: string
  @Field()
  type: string
  @Field({ nullable: true })
  assigned?: boolean
}

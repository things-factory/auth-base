import { Field, InputType } from 'type-graphql'
import { Privilege, Role } from '../../../entities'

@InputType()
export class RolePrivilege implements Partial<Role>, Partial<Privilege> {
  @Field()
  name: string
  @Field({ nullable: true })
  category?: string
  @Field({ nullable: true })
  description?: string
  @Field({ nullable: true })
  assigned?: boolean
}

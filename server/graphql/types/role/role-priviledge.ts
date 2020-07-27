import { Field, InputType } from 'type-graphql'
import { Priviledge, Role } from '../../../entities'

@InputType()
export class RolePriviledge implements Partial<Role>, Partial<Priviledge> {
  @Field()
  name: string
  @Field({ nullable: true })
  category?: string
  @Field({ nullable: true })
  description?: string
  @Field({ nullable: true })
  assigned?: boolean
}

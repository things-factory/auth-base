import { Field, InputType } from 'type-graphql'
import { PermitUrl } from '../../../entities'

@InputType()
export class NewPermitUrl extends PermitUrl {
  @Field()
  name: string
  @Field({ nullable: true })
  description?: string
  @Field()
  type: string
  @Field({ nullable: true })
  active?: boolean
}

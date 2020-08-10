import { Partial } from '@things-factory/graphql-utils'
import { Field, InputType } from 'type-graphql'
import { PermitUrl } from '../../../entities'

@InputType()
export class NewPermitUrl extends Partial(PermitUrl, { omits: ['id'] }) {
  @Field()
  name: string
  @Field({ nullable: true })
  description?: string
  @Field()
  type: string
  @Field({ nullable: true })
  active?: boolean
}

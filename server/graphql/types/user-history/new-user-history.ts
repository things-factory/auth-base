import { Field, InputType } from 'type-graphql'
import { UserHistory } from '../../../entities'

@InputType()
export class NewUserHistory extends UserHistory {
  @Field({ nullable: true })
  userAccountId?: string
  @Field({ nullable: true })
  status?: string
}

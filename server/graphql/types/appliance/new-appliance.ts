import { Field, InputType } from 'type-graphql'
import { Appliance } from '../../../entities/appliance'

@InputType()
export class NewAppliance extends Appliance {
  @Field()
  applianceId: string
  @Field()
  name: string
  @Field()
  brand: string
  @Field()
  model: string
  @Field()
  type: string
  @Field({ nullable: true })
  description?: string
}

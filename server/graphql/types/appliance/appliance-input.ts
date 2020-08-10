import { Partial } from '@things-factory/graphql-utils'
import { InputType } from 'type-graphql'
import { Appliance } from '../../../entities/appliance'

@InputType()
export class ApplianceInput extends Partial(Appliance, {
  omits: ['id']
}) {}

import { Partial } from '@things-factory/graphql-utils'
import { Privilege } from '../../../entities'
import { InputType } from 'type-graphql'

@InputType()
export class PrivilegePatch extends Partial(Privilege) {}

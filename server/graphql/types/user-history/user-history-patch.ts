import { Partial } from '@things-factory/graphql-utils'
import { UserHistory } from '../../../entities'
import { InputType } from 'type-graphql'

@InputType()
export class UserHistoryPatch extends Partial(UserHistory) {}

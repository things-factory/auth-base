import { Partial } from '@things-factory/graphql-utils'
import { UserHistory } from '../../../entities'

export class UserHistoryPatch extends Partial(UserHistory) {}

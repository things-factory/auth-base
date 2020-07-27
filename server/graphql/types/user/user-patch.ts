import { Partial } from '@things-factory/graphql-utils'
import { User } from '../../../entities'

export class UserPatch extends Partial(User) {}

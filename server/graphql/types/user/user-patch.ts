import { Partial } from '@things-factory/graphql-utils'
import { User } from '../../../entities'
import { InputType } from 'type-graphql'

@InputType()
export class UserPatch extends Partial(User) {}

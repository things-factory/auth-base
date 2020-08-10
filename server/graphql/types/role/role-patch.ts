import { Partial } from '@things-factory/graphql-utils'
import { Role } from '../../../entities'
import { InputType } from 'type-graphql'

@InputType()
export class RolePatch extends Partial(Role) {}

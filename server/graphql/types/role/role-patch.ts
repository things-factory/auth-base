import { Partial } from '@things-factory/graphql-utils'
import { Role } from '../../../entities'

export class RolePatch extends Partial(Role) {}

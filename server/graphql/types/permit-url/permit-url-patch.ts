import { Partial } from '@things-factory/graphql-utils'
import { PermitUrl } from '../../../entities'
import { InputType } from 'type-graphql'

@InputType()
export class PermitUrlPatch extends Partial(PermitUrl) {}

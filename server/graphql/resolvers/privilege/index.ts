import { privilegeResolver } from './privilege'
import { privilegesResolver } from './privileges'

import { updatePrivilege } from './update-privilege'
import { createPrivilege } from './create-privilege'
import { deletePrivilege } from './delete-privilege'

import { directivePrivilege } from './directive-privilege'

export const Query = {
  ...privilegesResolver,
  ...privilegeResolver
}

export const Mutation = {
  ...updatePrivilege,
  ...createPrivilege,
  ...deletePrivilege
}

export const Directive = {
  ...directivePrivilege
}

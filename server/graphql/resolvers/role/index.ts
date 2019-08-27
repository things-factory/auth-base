import { roleResolver } from './role'
import { rolesResolver } from './roles'
import { userRolesResolver } from './user-roles'

import { updateRole } from './update-role'
import { createRole } from './create-role'
import { deleteRole } from './delete-role'
import { deleteRoles } from './delete-roles'

export const Query = {
  ...rolesResolver,
  ...roleResolver,
  ...userRolesResolver
}

export const Mutation = {
  ...updateRole,
  ...createRole,
  ...deleteRole,
  ...deleteRoles
}

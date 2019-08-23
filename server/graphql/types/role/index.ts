import { NewRole } from './new-role'
import { Role } from './role'
import { RoleList } from './role-list'
import { RolePatch } from './role-patch'

export const Mutation = `
  createRole (
    role: NewRole!
  ): Role

  updateRole (
    name: String!
    patch: RolePatch!
  ): Role

  deleteRole (
    name: String!
  ): Role
`

export const Query = `
  roles(filters: [Filter], pagination: Pagination, sortings: [Sorting]): RoleList
  role(name: String!): Role
`

export const Types = [Role, NewRole, RolePatch, RoleList]

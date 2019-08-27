import { NewRole } from './new-role'
import { Role } from './role'
import { UserRole } from './user-role'
import { RoleList } from './role-list'
import { RolePatch } from './role-patch'

export const Mutation = `
  createRole (
    role: NewRole!
  ): Role @priviledge(category: "role", priviledge: "mutation")

  updateRole (
    name: String!
    patch: RolePatch!
  ): Role @priviledge(category: "role", priviledge: "mutation")

  deleteRole (
    name: String!
  ): Boolean @priviledge(category: "role", priviledge: "mutation")

  deleteRoles (
    names: [String]!
  ): Boolean @priviledge(category: "role", priviledge: "mutation")
`

export const Query = `
  userRoles: [UserRole] @priviledge(category: "role", priviledge: "query")
  roles(filters: [Filter], pagination: Pagination, sortings: [Sorting]): RoleList @priviledge(category: "role", priviledge: "query")
  role(name: String!): Role @priviledge(category: "role", priviledge: "query")
`

export const Types = [Role, UserRole, NewRole, RolePatch, RoleList]

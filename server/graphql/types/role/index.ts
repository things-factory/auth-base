import { NewRole } from './new-role'
import { Role } from './role'
import { UserRole } from './user-role'
import { RoleList } from './role-list'
import { RolePatch } from './role-patch'

export const Mutation = `
  createRole (
    role: NewRole!
  ): Role @priviledge(category: "user", priviledge: "mutation")

  updateRole (
    name: String!
    patch: RolePatch!
  ): Role @priviledge(category: "user", priviledge: "mutation")

  deleteRole (
    name: String!
  ): Boolean @priviledge(category: "user", priviledge: "mutation")

  deleteRoles (
    names: [String]!
  ): Boolean @priviledge(category: "user", priviledge: "mutation")
`

export const Query = `
  userRoles(userId: String!): [UserRole] @priviledge(category: "user", priviledge: "query")
  roles(filters: [Filter], pagination: Pagination, sortings: [Sorting]): RoleList @priviledge(category: "user", priviledge: "query")
  role(name: String!): Role @priviledge(category: "user", priviledge: "query")
`

export const Types = [Role, UserRole, NewRole, RolePatch, RoleList]

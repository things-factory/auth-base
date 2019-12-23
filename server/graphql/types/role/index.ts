import { NewRole } from './new-role'
import { Role } from './role'
import { UserRole } from './user-role'
import { RoleList } from './role-list'
import { RolePatch } from './role-patch'
import { RolePriviledge } from './role-priviledge'

export const Mutation = `
  createRole (
    role: NewRole!
  ): Role @priviledge(category: "user", priviledge: "mutation")

  updateRole (
    id: String!
    patch: RolePatch!
  ): Role @priviledge(category: "user", priviledge: "mutation")

  deleteRole (
    id: String!
  ): Boolean @priviledge(category: "user", priviledge: "mutation")

  deleteRoles (
    ids: [String]!
  ): Boolean @priviledge(category: "user", priviledge: "mutation")
`

export const Query = `
  userRoles(userId: String!): [UserRole] @priviledge(category: "user", priviledge: "query")
  rolePriviledges(roleId: String!): [RolePriviledge] @priviledge(category: "user", priviledge: "query")
  roles(filters: [Filter], pagination: Pagination, sortings: [Sorting]): RoleList @priviledge(category: "user", priviledge: "query")
  role(name: String!): Role @priviledge(category: "user", priviledge: "query")
`

export const Types = [Role, UserRole, RolePriviledge, NewRole, RolePatch, RoleList]

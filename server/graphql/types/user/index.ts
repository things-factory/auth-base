import { Filter, Pagination, Sorting } from '@things-factory/shell'
import { NewUser } from './new-user'
import { User } from './user'
import { UserList } from './user-list'
import { UserPatch } from './user-patch'

export const Mutation = `
  createUser (
    user: NewUser!
  ): User

  updateUser (
    email: String!
    patch: UserPatch!
  ): User

  deleteUser (
    email: String!
  ): Boolean
`

export const Query = `
  users(filters: [Filter], pagination: Pagination, sortings: [Sorting]): UserList
  user(email: String!): User @priviledge(role: "admin", priviledge: "get user")
`

export const Types = [User, NewUser, UserPatch, UserList]

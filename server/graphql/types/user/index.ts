import { NewUser } from './new-user'
import { User } from './user'
import { UserList } from './user-list'
import { UserPatch } from './user-patch'

export const Mutation = `
  createUser (
    user: NewUser!
  ): User @priviledge(priviledge: "create user")

  updateUser (
    email: String!
    patch: UserPatch!
  ): User @priviledge(priviledge: "update user")

  deleteUser (
    email: String!
  ): Boolean @priviledge(priviledge: "delete user")
`

export const Query = `
  users(filters: [Filter], pagination: Pagination, sortings: [Sorting]): UserList @priviledge(priviledge: "get users")
  user(email: String!): User @priviledge(priviledge: "get user")
`

export const Types = [User, NewUser, UserPatch, UserList]

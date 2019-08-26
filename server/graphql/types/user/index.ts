import { NewUser } from './new-user'
import { User } from './user'
import { UserList } from './user-list'
import { UserPatch } from './user-patch'

export const Mutation = `
  createUser (
    user: NewUser!
  ): User @priviledge(priviledge: "mutation")

  updateUser (
    email: String!
    patch: UserPatch!
  ): User @priviledge(priviledge: "mutation")

  deleteUser (
    email: String!
  ): Boolean @priviledge(priviledge: "mutation")
`

export const Query = `
  users(filters: [Filter], pagination: Pagination, sortings: [Sorting]): UserList @priviledge(priviledge: "query")
  user(email: String!): User @priviledge(priviledge: "query")
`

export const Types = [User, NewUser, UserPatch, UserList]

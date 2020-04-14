import { NewUser } from './new-user'
import { User } from './user'
import { UserList } from './user-list'
import { UserPatch } from './user-patch'

export const Mutation = `
  createUser (
    user: NewUser!
  ): User @priviledge(category: "user", priviledge: "mutation")

  updateUser (
    email: String!
    patch: UserPatch!
  ): User @priviledge(category: "user", priviledge: "mutation")

  updateMultipleUser (
    patches: [UserPatch]!
  ): [User]

  deleteUser (
    email: String!
  ): Boolean @priviledge(category: "user", priviledge: "mutation")

  deleteUsers (
    emails: [String]!
  ): Boolean @priviledge(category: "user", priviledge: "mutation")
`

export const Query = `
  users(filters: [Filter], pagination: Pagination, sortings: [Sorting]): UserList @priviledge(category: "user", priviledge: "query")
  user(email: String!): User @priviledge(category: "user", priviledge: "query")
`

export const Types = [User, NewUser, UserPatch, UserList]

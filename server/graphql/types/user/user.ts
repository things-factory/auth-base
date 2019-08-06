import { gql } from 'apollo-server-koa'

export const User = gql`
  type User {
    id: String
    name: String
    description: String
    email: String
    password: String
    roles: [Role]
    userType: String
    domain: Domain
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`

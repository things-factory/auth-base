import { gql } from 'apollo-server-koa'

export const Role = gql`
  type Role {
    name: String
    description: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`

import { gql } from 'apollo-server-koa'

export const Role = gql`
  type Role {
    id: String
    domain: Domain
    name: String
    users: [User]
    priviledges: [Priviledge]
    description: String
    creator: User
    updater: User
    creratedAt: String
    updatedAt: String
  }
`

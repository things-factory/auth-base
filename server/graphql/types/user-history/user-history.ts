import { gql } from 'apollo-server-koa'

export const UserHistory = gql`
  type UserHistory {
    id: String
    domain: Domain
    userAccount: User
    status: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`

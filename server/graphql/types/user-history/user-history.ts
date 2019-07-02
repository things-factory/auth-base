import { gql } from 'apollo-server-koa'

export const UserHistory = gql`
  type UserHistory {
    id: String
    domain: Domain
    userAccount: User
    statue: String
    creator: User
    updater: User
  }
`

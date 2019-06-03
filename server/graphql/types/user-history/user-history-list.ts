import { gql } from 'apollo-server-koa'

export const UserHistoryList = gql`
  type UserHistoryList {
    items: [UserHistory]
    total: Int
  }
`

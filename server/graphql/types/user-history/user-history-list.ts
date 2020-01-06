import gql from 'graphql-tag'

export const UserHistoryList = gql`
  type UserHistoryList {
    items: [UserHistory]
    total: Int
  }
`

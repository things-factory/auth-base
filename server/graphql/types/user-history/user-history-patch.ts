import { gql } from 'apollo-server-koa'

export const UserHistoryPatch = gql`
  input UserHistoryPatch {
    id: String
    userAccountId: String
    status: String
  }
`

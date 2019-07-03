import { gql } from 'apollo-server-koa'

export const NewUserHistory = gql`
  input NewUserHistory {
    userAccountId: String
    status: String
  }
`

import gql from 'graphql-tag'

export const NewUserHistory = gql`
  input NewUserHistory {
    userAccountId: String
    status: String
  }
`

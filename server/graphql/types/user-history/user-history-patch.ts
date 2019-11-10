import gql from 'graphql-tag'

export const UserHistoryPatch = gql`
  input UserHistoryPatch {
    id: String
    userAccountId: String
    status: String
  }
`

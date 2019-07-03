import { gql } from 'apollo-server-koa'

export const UserPatch = gql`
  input UserPatch {
    email: String
    password: String
    roles: [String]
    userType: String
  }
`

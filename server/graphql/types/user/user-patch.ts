import { gql } from 'apollo-server-koa'

export const UserPatch = gql`
  input UserPatch {
    name: String
    description: String
    email: String
    password: String
    roles: [String]
    userType: String
  }
`

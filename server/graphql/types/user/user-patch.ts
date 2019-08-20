import { gql } from 'apollo-server-koa'

export const UserPatch = gql`
  input UserPatch {
    id: String
    name: String
    description: String
    email: String
    password: String
    roles: [RolePatch]
    userType: String
  }
`

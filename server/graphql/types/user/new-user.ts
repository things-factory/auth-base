import { gql } from 'apollo-server-koa'

export const NewUser = gql`
  input NewUser {
    name: String!
    description: String
    email: String!
    password: String
    roles: [RolePatch]
    userType: String
  }
`

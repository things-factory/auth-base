import { gql } from 'apollo-server-koa'

export const NewUser = gql`
  input NewUser {
    name: String!
    email: String!
    password: String
    roles: [String]
    userType: String
  }
`

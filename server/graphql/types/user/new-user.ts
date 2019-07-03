import { gql } from 'apollo-server-koa'

export const NewUser = gql`
  input NewUser {
    email: String!
    password: String
    roles: [String]
    userType: String
  }
`

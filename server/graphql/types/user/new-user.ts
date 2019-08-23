import { gql } from 'apollo-server-koa'

export const NewUser = gql`
  input NewUser {
    name: String!
    domain: ObjectRef
    description: String
    email: String!
    password: String
    roles: [ObjectRef]
    userType: String
  }
`

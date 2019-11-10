import gql from 'graphql-tag'

export const NewUser = gql`
  input NewUser {
    name: String!
    domain: ObjectRef
    domains: [ObjectRef]
    description: String
    email: String!
    password: String
    roles: [ObjectRef]
    userType: String
  }
`

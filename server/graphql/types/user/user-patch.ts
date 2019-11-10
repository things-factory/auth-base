import gql from 'graphql-tag'

export const UserPatch = gql`
  input UserPatch {
    id: String
    name: String
    domain: ObjectRef
    domains: [ObjectRef]
    description: String
    email: String
    password: String
    roles: [ObjectRef]
    userType: String
    cuFlag: String
  }
`

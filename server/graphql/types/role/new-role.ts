import gql from 'graphql-tag'

export const NewRole = gql`
  input NewRole {
    id: String
    domain: ObjectRef
    name: String!
    users: [ObjectRef]
    priviledges: [ObjectRef]
    description: String
  }
`

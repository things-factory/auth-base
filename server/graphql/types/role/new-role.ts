import { gql } from 'apollo-server-koa'

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

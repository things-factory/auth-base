import { gql } from 'apollo-server-koa'

export const RolePatch = gql`
  input RolePatch {
    id: String
    name: String
    domain: ObjectRef
    users: [ObjectRef]
    priviledges: [ObjectRef]
    description: String
    cuFlag: String
  }
`

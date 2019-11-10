import gql from 'graphql-tag'

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

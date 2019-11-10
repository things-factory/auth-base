import gql from 'graphql-tag'

export const RolePriviledge = gql`
  type RolePriviledge {
    id: String
    name: String
    category: String
    description: String
    assigned: Boolean
  }
`

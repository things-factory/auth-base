import { gql } from 'apollo-server-koa'

export const RolePriviledge = gql`
  type RolePriviledge {
    id: String
    name: String
    category: String
    description: String
    assigned: Boolean
  }
`

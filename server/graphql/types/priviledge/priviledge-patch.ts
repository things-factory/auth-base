import { gql } from 'apollo-server-koa'

export const PriviledgePatch = gql`
  input PriviledgePatch {
    id: String
    name: String
    category: String
    description: String
    roles: [RolePatch]
  }
`

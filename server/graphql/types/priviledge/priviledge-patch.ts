import { gql } from 'apollo-server-koa'

export const PriviledgePatch = gql`
  input PriviledgePatch {
    name: String
    category: String
    description: String
    roles: [String]
  }
`

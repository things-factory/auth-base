import { gql } from 'apollo-server-koa'

export const PriviledgePatch = gql`
  input PriviledgePatch {
    name: String
    description: String
  }
`

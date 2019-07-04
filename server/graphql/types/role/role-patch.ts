import { gql } from 'apollo-server-koa'

export const RolePatch = gql`
  input RolePatch {
    name: String
    users: [String]
    priviledges: [String]
    description: String
  }
`

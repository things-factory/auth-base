import { gql } from 'apollo-server-koa'

export const RolePatch = gql`
  input RolePatch {
    name: String
    users: [String]
    priviledge: [String]
    description: String
  }
`

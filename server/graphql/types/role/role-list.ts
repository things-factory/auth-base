import { gql } from 'apollo-server-koa'

export const RoleList = gql`
  type RoleList {
    items: [Role]
    total: Int
  }
`

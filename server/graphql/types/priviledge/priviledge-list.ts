import { gql } from 'apollo-server-koa'

export const PriviledgeList = gql`
  type PriviledgeList {
    items: [Priviledge]
    total: Int
  }
`

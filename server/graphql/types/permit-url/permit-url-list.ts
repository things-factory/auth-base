import { gql } from 'apollo-server-koa'

export const PermitUrlList = gql`
  type PermitUrlList {
    items: [PermitUrl]
    total: Int
  }
`

import { gql } from 'apollo-server-koa'

export const UserList = gql`
  type UserList {
    items: [User]
    total: Int
  }
`

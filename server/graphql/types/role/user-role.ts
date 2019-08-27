import { gql } from 'apollo-server-koa'

export const UserRole = gql`
  type UserRole {
    id: String
    name: String
    description: String
    assigned: Boolean
  }
`

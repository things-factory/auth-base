import { gql } from 'apollo-server-koa'

export const Priviledge = gql`
  type Priviledge {
    id: String
    name: String
    domain: Domain
    description: String
    creator: User
    updater: User
  }
`

import { gql } from 'apollo-server-koa'

export const Appliance = gql`
  type Appliance {
    id: String
    name: String
    domain: Domain
    description: String
    creator: User
    updater: User
  }
`

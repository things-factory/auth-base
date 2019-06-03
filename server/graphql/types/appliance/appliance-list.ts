import { gql } from 'apollo-server-koa'

export const ApplianceList = gql`
  type ApplianceList {
    items: [Appliance]
    total: Int
  }
`

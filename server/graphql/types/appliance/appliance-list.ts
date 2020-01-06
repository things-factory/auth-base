import gql from 'graphql-tag'

export const ApplianceList = gql`
  type ApplianceList {
    items: [Appliance]
    total: Int
  }
`

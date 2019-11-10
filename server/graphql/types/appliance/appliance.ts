import gql from 'graphql-tag'

export const Appliance = gql`
  type Appliance {
    id: String
    applianceId: String
    domain: Domain
    name: String
    brand: String
    model: String
    type: String
    description: String
    creator: User
    updater: User
    creratedAt: String
    updatedAt: String
  }
`

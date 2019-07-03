import { gql } from 'apollo-server-koa'

export const NewAppliance = gql`
  input NewAppliance {
    applianceId: String!
    name: String!
    brand: String!
    model: String!
    type: String!
    description: String
  }
`

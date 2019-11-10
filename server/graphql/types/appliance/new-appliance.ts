import gql from 'graphql-tag'

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

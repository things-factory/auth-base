import gql from 'graphql-tag'

export const AppliancePatch = gql`
  input AppliancePatch {
    id: String
    applianceId: String
    name: String
    brand: String
    model: String
    type: String
    description: String
  }
`

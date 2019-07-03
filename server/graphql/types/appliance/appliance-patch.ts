import { gql } from 'apollo-server-koa'

export const AppliancePatch = gql`
  input AppliancePatch {
    applianceId: String
    name: String
    brand: String
    model: String
    type: String
    description: String
  }
`

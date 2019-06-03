import { gql } from 'apollo-server-koa'

export const AppliancePatch = gql`
  input AppliancePatch {
    name: String
    description: String
  }
`

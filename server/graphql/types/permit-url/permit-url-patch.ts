import { gql } from 'apollo-server-koa'

export const PermitUrlPatch = gql`
  input PermitUrlPatch {
    name: String
    description: String
    type: String
    active: Boolean
  }
`

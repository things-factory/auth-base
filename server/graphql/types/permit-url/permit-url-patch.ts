import { gql } from 'apollo-server-koa'

export const PermitUrlPatch = gql`
  input PermitUrlPatch {
    id: String
    name: String
    description: String
    type: String
    active: Boolean
  }
`

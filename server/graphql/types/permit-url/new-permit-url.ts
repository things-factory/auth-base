import { gql } from 'apollo-server-koa'

export const NewPermitUrl = gql`
  input NewPermitUrl {
    name: String!
    description: String
    type: String!
    active: Boolean
  }
`

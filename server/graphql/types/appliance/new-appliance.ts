import { gql } from 'apollo-server-koa'

export const NewAppliance = gql`
  input NewAppliance {
    name: String!
    description: String
  }
`

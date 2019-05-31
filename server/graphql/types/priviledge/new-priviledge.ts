import { gql } from 'apollo-server-koa'

export const NewPriviledge = gql`
  input NewPriviledge {
    name: String!
    description: String
  }
`

import gql from 'graphql-tag'

export const NewPriviledge = gql`
  input NewPriviledge {
    name: String!
    category: String!
    description: String
    roles: [RolePatch]
  }
`

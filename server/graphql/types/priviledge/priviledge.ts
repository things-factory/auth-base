import gql from 'graphql-tag'

export const Priviledge = gql`
  type Priviledge {
    id: String
    domain: Domain
    name: String
    roles: [Role]
    category: String
    description: String
    creator: User
    updater: User
    creratedAt: String
    updatedAt: String
  }
`

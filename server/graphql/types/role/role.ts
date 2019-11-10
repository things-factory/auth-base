import gql from 'graphql-tag'

export const Role = gql`
  type Role {
    id: String
    domain: Domain
    name: String
    users: [User]
    priviledges: [Priviledge]
    description: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`

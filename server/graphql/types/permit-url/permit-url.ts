import gql from 'graphql-tag'

export const PermitUrl = gql`
  type PermitUrl {
    id: String
    domain: Domain
    name: String
    description: String
    type: String
    active: Boolean
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`

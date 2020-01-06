import gql from 'graphql-tag'

export const User = gql`
  type User {
    id: String
    name: String
    description: String
    email: String
    password: String
    roles: [Role]
    userType: String
    domain: Domain
    domains: [Domain]
    locale: String
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`

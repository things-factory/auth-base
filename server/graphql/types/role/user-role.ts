import gql from 'graphql-tag'

export const UserRole = gql`
  type UserRole {
    id: String
    name: String
    description: String
    assigned: Boolean
  }
`

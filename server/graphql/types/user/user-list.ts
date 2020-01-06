import gql from 'graphql-tag'

export const UserList = gql`
  type UserList {
    items: [User]
    total: Int
  }
`

import gql from 'graphql-tag'

export const RoleList = gql`
  type RoleList {
    items: [Role]
    total: Int
  }
`

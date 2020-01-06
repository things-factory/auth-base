import gql from 'graphql-tag'

export const PriviledgeList = gql`
  type PriviledgeList {
    items: [Priviledge]
    total: Int
  }
`

import gql from 'graphql-tag'

export const PermitUrlList = gql`
  type PermitUrlList {
    items: [PermitUrl]
    total: Int
  }
`

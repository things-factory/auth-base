import gql from 'graphql-tag'

export const NewPermitUrl = gql`
  input NewPermitUrl {
    name: String!
    description: String
    type: String!
    active: Boolean
  }
`

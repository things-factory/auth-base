import { gql } from 'apollo-server-koa'

export const NewRole = gql`
  input NewRole {
    id: String
    name: String!
    users: [UserPatch]
    priviledges: [PriviledgePatch]
    description: String
  }
`

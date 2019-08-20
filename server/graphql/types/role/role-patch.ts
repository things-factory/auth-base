import { gql } from 'apollo-server-koa'

export const RolePatch = gql`
  input RolePatch {
    id: String
    name: String
    users: [UserPatch]
    priviledges: [PriviledgePatch]
    description: String
  }
`

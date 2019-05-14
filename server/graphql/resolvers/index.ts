import * as User from './user'
import * as UserHistory from './user-history'
import * as UserRoleHistory from './user-role-history'
import * as UsersRole from './users-role'
import * as PermitUrl from './permit-url'
import * as Role from './role'

export const resolvers = {
  Query: {
    ...User.Query,
    ...UserHistory.Query,
    ...UserRoleHistory.Query,
    ...UsersRole.Query,
    ...PermitUrl.Query,
    ...Role.Query
  },

  Mutation: {
    ...User.Mutation,
    ...UserHistory.Mutation,
    ...UserRoleHistory.Mutation,
    ...UsersRole.Mutation,
    ...PermitUrl.Mutation,
    ...Role.Mutation
  }
}

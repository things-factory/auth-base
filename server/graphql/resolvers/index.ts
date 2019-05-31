import * as User from './user'
import * as UserHistory from './user-history'
import * as PermitUrl from './permit-url'
import * as Role from './role'
import * as Priviledge from './priviledge'

export const queries = [User.Query, UserHistory.Query, PermitUrl.Query, Role.Query, Priviledge.Query]

export const mutations = [User.Mutation, UserHistory.Mutation, PermitUrl.Mutation, Role.Mutation, Priviledge.Mutation]

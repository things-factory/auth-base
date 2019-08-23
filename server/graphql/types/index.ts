import * as User from './user'
import * as UserHistory from './user-history'
import * as PermitUrl from './permit-url'
import * as Role from './role'
import * as Priviledge from './priviledge'
import * as Appliance from './appliance'
import { Filter, Pagination, Sorting, ObjectRef } from '@things-factory/shell'

export const queries = [User.Query, UserHistory.Query, PermitUrl.Query, Role.Query, Priviledge.Query, Appliance.Query]

export const mutations = [
  User.Mutation,
  UserHistory.Mutation,
  PermitUrl.Mutation,
  Role.Mutation,
  Priviledge.Mutation,
  Appliance.Mutation
]

export const types = [
  Filter,
  Pagination,
  Sorting,
  ObjectRef,
  ...User.Types,
  ...UserHistory.Types,
  ...PermitUrl.Types,
  ...Role.Types,
  ...Priviledge.Types,
  ...Appliance.Types
]

export const directives = [...Priviledge.Directives]

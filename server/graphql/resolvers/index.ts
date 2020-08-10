// import * as User from './user'
// import * as UserHistory from './user-history'
// import * as Role from './role'
// import * as Privilege from './privilege'
// import * as Appliance from './appliance'

import { ApplianceResolver } from './appliance.resolver'
import { PermitUrlResolver } from './permit-url.resolver'
import { UserResolver } from './user.resolver'
export default [ApplianceResolver, PermitUrlResolver, UserResolver]

// export const queries = [User.Query, UserHistory.Query, PermitUrl.Query, Role.Query, Privilege.Query, Appliance.Query]

// export const mutations = [
//   User.Mutation,
//   UserHistory.Mutation,
//   PermitUrl.Mutation,
//   Role.Mutation,
//   Privilege.Mutation,
//   Appliance.Mutation
// ]

// export const directives = [Privilege.Directive]

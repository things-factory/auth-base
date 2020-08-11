// import * as User from './user'
// import * as UserHistory from './user-history'
// import * as Role from './role'
// import * as Privilege from './privilege'
// import * as Appliance from './appliance'

import { ApplianceResolver } from './appliance.resolver'
import { PermitUrlResolver } from './permit-url.resolver'
import { PrivilegeResolver } from './privilege.resolver'
import { RoleResolver } from './role.resolver'
import { UserResolver } from './user.resolver'
export default [ApplianceResolver, PermitUrlResolver, UserResolver, PrivilegeResolver, RoleResolver]

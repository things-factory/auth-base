import { ApplianceResolver } from './appliance.resolver'
import { PermitUrlResolver } from './permit-url.resolver'
import { PrivilegeResolver } from './privilege.resolver'
import { RoleResolver } from './role.resolver'
import { UserHistoryResolver } from './user-history.resolver'
import { UserResolver } from './user.resolver'
export default [
  ApplianceResolver,
  PermitUrlResolver,
  UserResolver,
  PrivilegeResolver,
  RoleResolver,
  UserHistoryResolver
]

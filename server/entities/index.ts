import { Appliance } from './appliance'
import { PermitUrl } from './permit-url'
import { Privilege } from './privilege'
import { Role } from './role'
import { User, UserStatus } from './user'
import { UserHistory } from './user-history'
import { VerificationToken, VerificationTokenType } from './verification-token'

export const entities = [User, UserHistory, Role, PermitUrl, Privilege, Appliance, VerificationToken]
export {
  User,
  UserStatus,
  UserHistory,
  Role,
  PermitUrl,
  Privilege,
  Appliance,
  VerificationToken,
  VerificationTokenType
}

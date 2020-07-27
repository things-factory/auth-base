import { Appliance } from './appliance'
import { PermitUrl } from './permit-url'
import { Priviledge } from './priviledge'
import { Role } from './role'
import { User, UserStatus } from './user'
import { UserHistory } from './user-history'
import { VerificationToken, VerificationTokenType } from './verification-token'

export const entities = [User, UserHistory, Role, PermitUrl, Priviledge, Appliance, VerificationToken]
export {
  User,
  UserStatus,
  UserHistory,
  Role,
  PermitUrl,
  Priviledge,
  Appliance,
  VerificationToken,
  VerificationTokenType
}

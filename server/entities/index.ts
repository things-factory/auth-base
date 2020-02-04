import { User, UserStatus } from './user'
import { UserHistory } from './user-history'
import { Role } from './role'
import { PermitUrl } from './permit-url'
import { Priviledge } from './priviledge'
import { Appliance } from './appliance'
import { UsersTokens } from './users-tokens'
import { VerificationToken, VerificationTokenType } from './verification-token'

export const entities = [User, UserHistory, Role, PermitUrl, Priviledge, Appliance, UsersTokens, VerificationToken]
export {
  User,
  UserStatus,
  UserHistory,
  Role,
  PermitUrl,
  Priviledge,
  Appliance,
  UsersTokens,
  VerificationToken,
  VerificationTokenType
}

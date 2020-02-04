import { getRepository } from 'typeorm'
import { User, UserStatus } from '../entities'
import { AuthError } from '../errors/auth-error'
import { sendUnlockAccountEmail } from '../controllers/unlock-account'
import { createRefreshToken } from '../controllers/refresh-token'
import { makeRefreshToken } from './utils/make-refresh-token'
import { UsersTokens } from '../entities/users-tokens'
export async function signin(attrs, context?) {
  const userRepo = getRepository(User)
  const usersTokensRepo = getRepository(UsersTokens)
  const user = await userRepo.findOne({ where: { email: attrs.email }, relations: ['domain', 'domains'] })
  var refreshToken
  if (!user)
    throw new AuthError({
      errorCode: AuthError.ERROR_CODES.USER_NOT_FOUND
    })

  if (user.status == UserStatus.DELETED) {
    throw new AuthError({
      errorCode: AuthError.ERROR_CODES.USER_DELETED
    })
  }

  if (user.status == UserStatus.LOCKED) {
    sendUnlockAccountEmail({
      user,
      context
    })
    throw new AuthError({
      errorCode: AuthError.ERROR_CODES.USER_LOCKED
    })
  }

  if (!user.verify(attrs.password)) {
    user.failCount++
    if (user.failCount >= 5) user.status = UserStatus.LOCKED
    await userRepo.save(user)
    if (user.status == UserStatus.LOCKED) {
      sendUnlockAccountEmail({
        user,
        context
      })
      throw new AuthError({
        errorCode: AuthError.ERROR_CODES.USER_LOCKED
      })
    }
    throw new AuthError({
      errorCode: AuthError.ERROR_CODES.PASSWORD_NOT_MATCHED,
      detail: {
        failCount: user.failCount
      }
    })
  } else {
    user.failCount = 0
    await userRepo.save(user)
    refreshToken = await createRefreshToken(user)
  }

  if (user.status == UserStatus.INACTIVE) {
    throw new AuthError({
      errorCode: AuthError.ERROR_CODES.USER_NOT_ACTIVATED
    })
  }

  return {
    user,
    tokens: {
      accessToken: await user.sign(),
      refreshToken
    },
    domains: user.domains || []
  }
}

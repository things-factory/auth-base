import { getRepository } from 'typeorm'
import { sendUnlockAccountEmail } from '../controllers/unlock-account'
import { User, UserStatus } from '../entities'
import { AuthError } from '../errors/auth-error'
export async function signin(attrs, context?) {
  const repository = getRepository(User)
  const user = await repository.findOne({ where: { email: attrs.email } })
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
    await repository.save(user)
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
    await repository.save(user)
  }

  if (user.status == UserStatus.INACTIVE) {
    throw new AuthError({
      errorCode: AuthError.ERROR_CODES.USER_NOT_ACTIVATED
    })
  }

  return {
    user,
    token: await user.sign(),
    domains: user.domains || []
  }
}

import { getRepository } from 'typeorm'
import { PASSWORD_NOT_MATCHED, USER_DELETED, USER_NOT_FOUND, USER_NOT_ACTIVATED } from '../constants/error-code'
import { User, UserStatus } from '../entities'
import { AuthError } from '../errors/auth-error'
export async function signin(attrs) {
  const repository = getRepository(User)
  const user = await repository.findOne({ where: { email: attrs.email }, relations: ['domain', 'domains'] })
  if (!user)
    throw new AuthError({
      errorCode: USER_NOT_FOUND
    })

  if (user.status == UserStatus.DELETED) {
    throw new AuthError({
      errorCode: USER_DELETED
    })
  }

  if (!user.verify(attrs.password)) {
    user.failCount++
    if (user.failCount >= 5) user.status = UserStatus.LOCKED
    await repository.save(user)
    throw new AuthError({
      errorCode: PASSWORD_NOT_MATCHED
    })
  } else {
    user.failCount = 0
    await repository.save(user)
  }

  if (user.status == UserStatus.INACTIVE) {
    throw new AuthError({
      errorCode: USER_NOT_ACTIVATED
    })
  }

  return {
    user,
    token: await user.sign(),
    domains: user.domains || []
  }
}

import { getRepository } from 'typeorm'
import { PASSWORD_NOT_MATCHED, USER_NOT_ACTIVATED, USER_NOT_FOUND } from '../constants/error-code'
import { User } from '../entities'
import { AuthError } from '../errors/auth-error'
export async function signin(attrs) {
  const repository = getRepository(User)
  const user = await repository.findOne({ where: { email: attrs.email }, relations: ['domain', 'domains'] })
  if (!user)
    throw new AuthError({
      errorCode: USER_NOT_FOUND
    })

  if (!user.verify(attrs.password)) {
    throw new AuthError({
      errorCode: PASSWORD_NOT_MATCHED
    })
  }

  return {
    token: await user.sign(),
    domains: user.domains || []
  }
}

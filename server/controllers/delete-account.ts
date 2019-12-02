import { getRepository } from 'typeorm'
import { User, UserStatus } from '../entities'
import { AuthError } from '../errors/auth-error'
import { USER_NOT_FOUND } from '../constants/error-code'
export async function deleteAccount(attrs, newPass) {
  const repository = getRepository(User)
  const user = await repository.findOne({ where: { email: attrs.email }, relations: ['domain'] })
  if (!user) {
    throw new AuthError({
      errorCode: USER_NOT_FOUND
    })
  }

  user.status = UserStatus.DELETED // TODO: flag 변경 후 특정 기간 이후 삭제
  await repository.save(user)

  return true
}

import { getRepository, In } from 'typeorm'
import { User, UserStatus } from '../entities'
import { AuthError } from '../errors/auth-error'
import { USER_NOT_FOUND } from '../constants/error-code'
export async function deleteAccount(attrs) {
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

export async function deleteAccounts(attrs) {
  const { emails } = attrs
  const repo = getRepository(User)
  const users = await repo.find({
    where: {
      email: In(emails)
    }
  })

  users.forEach(user => (user.status = UserStatus.DELETED))

  await repo.save(users)
  return true
}

import { getRepository, getConnection, In } from 'typeorm'
import { User, UserStatus } from '../entities'
import { AuthError } from '../errors/auth-error'
import { USER_NOT_FOUND } from '../constants/error-code'
export async function deleteAccount(attrs) {
  await getConnection().transaction(async (txManager) => {
    const repository = txManager.getRepository(User)
    const user = await repository.findOne({ where: { email: attrs.email }, relations: ['domain'] })
    if (!user) {
      throw new AuthError({
        errorCode: USER_NOT_FOUND,
      })
    }

    user.status = UserStatus.DELETED // TODO: flag 변경 후 특정 기간 이후 삭제

    await repository.save(user)

    // repository api는 작동하지 않음.
    await txManager
      .createQueryBuilder()
      .delete()
      .from('users_domains')
      .where({
        usersId: user.id,
      })
      .execute()
  })

  return true
}

export async function deleteAccounts(attrs) {
  const { emails } = attrs
  await getConnection().transaction(async (txManager) => {
    const repo = txManager.getRepository(User)

    const users = await repo.find({
      where: {
        email: In(emails),
      },
    })

    const userIds = []
    users.forEach((user) => {
      user.status = UserStatus.DELETED
      userIds.push(user.id)
    })
    await repo.save(users)

    // repository api는 작동하지 않음.
    await txManager
      .createQueryBuilder()
      .delete()
      .from('users_domains')
      .where({
        usersId: In(userIds),
      })
      .execute()
  })
  return true
}

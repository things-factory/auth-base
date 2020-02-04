import { getRepository, MoreThan } from 'typeorm'
import { makeRefreshToken } from '../controllers/utils/make-refresh-token'
import { UsersTokens } from '../entities/users-tokens'

export async function createRefreshToken(user) {
  const usersTokensRepo = getRepository(UsersTokens)
  const refreshToken = await makeRefreshToken(user)
  var expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 1)
  await usersTokensRepo.save({
    user,
    token: refreshToken,
    expiresAt
  })

  return refreshToken
}

export async function extendRefreshToken(token: string) {
  var now = new Date()
  const usersTokensRepo = getRepository(UsersTokens)
  var found = await usersTokensRepo.findOne({
    where: {
      token,
      expiresAt: MoreThan(now)
    },
    relations: ['user']
  })

  if (found) {
    var accessToken = await found.user.sign()
    found.expiresAt = new Date(now.setMonth(now.getMonth() + 1))
    await usersTokensRepo.save(found)

    return {
      accessToken,
      refreshToken: token
    }
  }
}

export async function deleteRefreshToken(token) {
  const usersTokensRepo = getRepository(UsersTokens)
  await usersTokensRepo.delete({
    token
  })
}

import { getRepository } from 'typeorm'
import { USER_NOT_FOUND } from '../constants/error-code'
import { User } from '../entities'
import { AuthError } from '../errors/auth-error'
export async function updateProfile(attrs, newProfiles) {
  const repository = getRepository(User)
  const user = await repository.findOne({ where: { id: attrs.id }, relations: ['domain'] })
  if (!user) {
    throw new AuthError({
      errorCode: USER_NOT_FOUND
    })
  }

  Object.assign(user, newProfiles)
  return await repository.save(user)
}

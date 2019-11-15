import { getRepository } from 'typeorm'
import { User } from '../entities'
import { AuthError } from '../errors/auth-error'
import { USER_NOT_FOUND } from '../constants/error-code'
export async function changePwd(attrs, newPass) {
  const repository = getRepository(User)
  const user = await repository.findOne({ where: { email: attrs.email }, relations: ['domain'] })
  if (!user) {
    throw new AuthError({
      errorCode: USER_NOT_FOUND
    })
  }
  user.password = User.encode(newPass)
  await repository.save(user)
  return await user.sign()
}

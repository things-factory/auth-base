import { getRepository } from 'typeorm'
import { User } from '../entities'
import { sendVerificationEmail } from './verification'
import { signin } from './signin'
export async function signup(attrs, withEmailVerification?: Boolean) {
  const repository = getRepository(User)
  const old = await repository.findOne({ email: attrs.email })
  if (old) {
    throw new Error('user duplicated.')
  }
  const newattrs = {
    userType: 'user',
    ...attrs,
    password: User.encode(attrs.password)
  }
  const user = await repository.save({ ...newattrs })
  var succeed = false
  if (withEmailVerification) {
    succeed = await sendVerificationEmail({
      context: attrs.context,
      user
    })
  }
  try {
    return {
      token: await signin({
        email: attrs.email,
        password: attrs.password
      })
    }
  } catch (e) {
    return { token: null, domains: [], user }
  }
}

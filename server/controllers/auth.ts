import { getRepository } from 'typeorm'
import { User } from '../entities'

export async function signup(attrs) {
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

  return await signin({
    email: attrs.email,
    password: attrs.password
  })
}

export async function signin(attrs) {
  const repository = getRepository(User)

  const user = await repository.findOne({ where: { email: attrs.email }, relations: ['domain'] })

  if (!user) {
    throw new Error('user not found.')
  }

  if (!user.verify(attrs.password)) {
    throw new Error('password not match.')
  }

  return await user.sign()
}

export async function authcheck(email) {
  const repository = getRepository(User)
  const user = await repository.findOne({ where: { email }, relations: ['domain'] })

  if (!user) {
    throw new Error('user not found.')
  }

  return await user.sign()
}

export async function changePwd(attrs, newPass) {
  const repository = getRepository(User)

  const user = await repository.findOne({ where: { email: attrs.email }, relations: ['domain'] })

  if (!user) {
    throw new Error('user not found.')
  }

  user.password = User.encode(newPass)
  await repository.save(user)

  return await user.sign()
}

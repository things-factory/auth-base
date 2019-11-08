import { getRepository } from 'typeorm'
import { User } from '../entities'
import { DomainNotAvailableException } from '../exception/domain-not-available-exception'

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

  const user = await repository.findOne({ where: { email: attrs.email }, relations: ['domain', 'domains'] })

  if (!user) {
    throw new Error('user not found.')
  }

  if (!user.verify(attrs.password)) {
    throw new Error('password not match.')
  }

  return {
    token: await user.sign(),
    domains: user.domains || []
  }
}

export async function authcheck({ id, domain }) {
  const repository = getRepository(User)
  const user = await repository.findOne({ where: { id }, relations: ['domain', 'domains'] })

  // id와 일치하는 유저가 있는지 체크\
  if (!user) {
    throw new Error('user not found.')
  }

  // 유저가 접속할 수 있는 도메인이 존재하는지 확인
  if (!user.domains || !user.domains.length) {
    throw new Error('domain not found.')
  }

  var token = await user.sign()
  var domains = user.domains

  // 접속한 URL과 일치하는 도메인이 존재하는지 확인
  if (domain) {
    var foundDomain = domains.find(d => d.subdomain == domain)

    if (!foundDomain) {
      throw new DomainNotAvailableException({
        message: 'domain is not available to user.',
        domains: domains
      })
    } else {
      user.domain = foundDomain
      await repository.save(user)
    }
  }

  return {
    token,
    domains
  }
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

import { getRepository } from 'typeorm'
import * as ERROR_CODES from '../constants/error-code'
import { User } from '../entities'
import { AuthError } from '../errors/auth-error'
import { UserDomainNotMatchError } from '../errors/user-domain-not-match-error'
export async function authcheck({ id, domain }) {
  const repository = getRepository(User)
  const user = await repository.findOne({ where: { id }, relations: ['domain', 'domains'] })
  // id와 일치하는 유저가 있는지 체크
  if (!user)
    throw new AuthError({
      errorCode: ERROR_CODES.USER_NOT_FOUND
    })
  if (!user.activated)
    throw new AuthError({
      errorCode: ERROR_CODES.USER_NOT_ACTIVATED
    })
  // 유저가 접속할 수 있는 도메인이 존재하는지 확인
  if (!user.domains || !user.domains.length)
    throw new UserDomainNotMatchError({
      errorCode: ERROR_CODES.NO_AVAILABLE_DOMAIN,
      domains: []
    })
  var domains = user.domains
  // 접속한 URL과 일치하는 도메인이 존재하는지 확인
  if (domain) {
    var foundDomain = domains.find(d => d.subdomain == domain)
    if (!foundDomain)
      throw new UserDomainNotMatchError({
        errorCode: ERROR_CODES.UNAVAILABLE_DOMAIN,
        domains: domains
      })
    else {
      user.domain = foundDomain
      await repository.save(user)
    }
  }
  var token = await user.sign()
  return {
    token,
    domains
  }
}

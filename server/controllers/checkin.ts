import { getRepository } from 'typeorm'
import { User } from '../entities'

export async function checkin({ user }: { user: User }) {
  const domain = await user.domain
  return domain?.subdomain
}

export async function checkinTo({ user, domainName }: { user: User; domainName: String }) {
  const userDomains = await user.domains
  const userRepo = getRepository(User)

  if (!userDomains) return false
  const domains = await userDomains
  const domain = domains.find(domain => domain.subdomain == domainName)
  if (!domain) return false

  user.domain = Promise.resolve(domain)
  await userRepo.save(user)

  return true
}

import { getRepository } from 'typeorm'
import { User } from '../entities'

export async function checkin({ userId, domainName }) {
  const userRepo = getRepository(User)
  const user = await userRepo.findOne({ where: { id: userId }, relations: ['domain', 'domains'] })

  if (!user.domains) return false
  const domains = await user.domains
  const domain = domains.find(domain => domain.subdomain == domainName)
  if (!domain) return false

  user.domain = Promise.resolve(domain)
  await userRepo.save(user)

  return await user.sign()
}

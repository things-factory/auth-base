import { Domain } from '@things-factory/shell'
import { User } from '../entities'
import { Repository, EntityManager, getRepository, SelectQueryBuilder } from 'typeorm'

export async function getDomainUsers(domain: Partial<Domain>, trxMgr?: EntityManager): Promise<User[]> {
  const domainRepo: Repository<Domain> = trxMgr?.getRepository(Domain) || getRepository(Domain)
  const userRepo: Repository<User> = trxMgr?.getRepository(User) || getRepository(User)

  if (!domain.id) {
    const foundDomain: Domain = await domainRepo.findOne({ where: { ...domain } })
    if (!foundDomain) throw new Error(`Failed to find domain by passed condition, ${domain}`)

    domain = foundDomain
  }

  const { id: domainId }: { id: string } = domain
  const qb: SelectQueryBuilder<User> = userRepo.createQueryBuilder('USER')
  return await qb
    .select()
    .where(
      `USER.id IN ${qb
        .subQuery()
        .select('"USERS_DOMAINS"."users_id"')
        .from('users_domains', 'USERS_DOMAINS')
        .where('"USERS_DOMAINS"."domains_id" = :domainId', { domainId })
        .getQuery()}`
    )
    .getMany()
}

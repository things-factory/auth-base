import { getRepository } from 'typeorm'
import { Role } from '../../../entities'
import { Domain } from '@things-factory/domain-base'

export const roleResolver = {
  async role(_: any, { name }, context: any) {
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }
    return await getRepository(Role).findOne({
      where: { domain: context.state.domainEntity, name },
      relations: ['domain', 'users', 'privileges', 'creator', 'updater']
    })
  }
}

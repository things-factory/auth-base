import { Domain } from '@things-factory/domain-base'
import { getRepository } from 'typeorm'
import { Privilege } from '../../../entities'

export const privilegeResolver = {
  async privilege(_: any, { name }, context: any) {
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }

    return await getRepository(Privilege).findOne({
      where: { domain: context.state.domainEntity, name },
      relations: ['domain', 'roles', 'creator', 'updater']
    })
  }
}

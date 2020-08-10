import { getRepository } from 'typeorm'
import { PermitUrl } from '../../../entities'
import { Domain } from '@things-factory/domain-base'

export const permitUrlResolver = {
  async permitUrl(_: any, { name }, context: any) {
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }
    return await getRepository(PermitUrl).findOne({
      where: { domain: context.state.domainEntity, name },
      relations: ['domain', 'creator', 'updater']
    })
  }
}

import { getRepository } from 'typeorm'
import { PermitUrl } from '../../../entities'
import { Domain } from '@things-factory/domain-base'

export const updatePermitUrl = {
  async updatePermitUrl(_: any, { name, patch }, context: any) {
    const repository = getRepository(PermitUrl)
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }
    const permitUrl = await repository.findOne({ where: { domain: context.state.domainEntity, name } })

    return await repository.save({
      ...permitUrl,
      ...patch,
      updater: context.state.user
    })
  }
}

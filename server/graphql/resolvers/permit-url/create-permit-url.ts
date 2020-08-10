import { getRepository } from 'typeorm'
import { PermitUrl } from '../../../entities'
import { Domain } from '@things-factory/domain-base'

export const createPermitUrl = {
  async createPermitUrl(_: any, { permitUrl }, context: any) {
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }
    return await getRepository(PermitUrl).save({
      domain: context.state.domainEntity,
      creator: context.state.user,
      updater: context.state.user,
      ...permitUrl
    })
  }
}

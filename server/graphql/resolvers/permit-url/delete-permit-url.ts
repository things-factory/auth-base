import { getRepository } from 'typeorm'
import { PermitUrl } from '../../../entities'
import { Domain } from '@things-factory/domain-base'

export const deletePermitUrl = {
  async deletePermitUrl(_: any, { name }, context: any) {
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }
    await getRepository(PermitUrl).delete({ domain: context.state.domainEntity, name })
    return true
  }
}

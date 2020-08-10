import { getRepository } from 'typeorm'
import { Privilege } from '../../../entities'
import { Domain } from '@things-factory/domain-base'

export const deletePrivilege = {
  async deletePrivilege(_: any, { name }, context: any) {
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }
    await getRepository(Privilege).delete({ domain: context.state.domainEntity, name })
    return true
  }
}

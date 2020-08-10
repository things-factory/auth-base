import { Domain } from '@things-factory/domain-base'
import { getRepository } from 'typeorm'
import { UserHistory } from '../../../entities'

export const deleteUserHistory = {
  async deleteUserHistory(_: any, { id }, context: any) {
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }
    return await getRepository(UserHistory).delete({ domain: context.state.domainEntity, id })
  }
}

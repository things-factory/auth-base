import { getRepository } from 'typeorm'
import { UserHistory } from '../../../entities'
import { Domain } from '@things-factory/domain-base'

export const createUserHistory = {
  async createUserHistory(_: any, { userHistory }, context: any) {
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }
    return await getRepository(UserHistory).save({
      domain: context.state.domainEntity,
      creator: context.state.user,
      updater: context.state.user,
      ...userHistory
    })
  }
}

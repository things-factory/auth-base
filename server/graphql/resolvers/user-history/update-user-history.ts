import { getRepository } from 'typeorm'
import { UserHistory } from '../../../entities'
import { Domain } from '@things-factory/domain-base'

export const updateUserHistory = {
  async updateUserHistory(_: any, { id, patch }, context: any) {
    const repository = getRepository(UserHistory)
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }
    const userHistory = await repository.findOne({ domain: context.state.domainEntity, id })

    return await repository.save({
      ...userHistory,
      ...patch,
      updater: context.state.user
    })
  }
}

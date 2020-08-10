import { getRepository } from 'typeorm'
import { UserHistory } from '../../../entities'
import { Domain } from '@things-factory/domain-base'

export const userHistoryResolver = {
  async userHistory(_: any, { id }, context: any) {
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }
    return await getRepository(UserHistory).findOne({
      where: { domain: context.state.domainEntity, id },
      relations: ['domain', 'userAccount', 'creator', 'updater']
    })
  }
}

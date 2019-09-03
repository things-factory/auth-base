import { getRepository } from 'typeorm'
import { UserHistory } from '../../../entities'

export const userHistoryResolver = {
  async userHistory(_: any, { id }, context: any) {
    return await getRepository(UserHistory).findOne({
      where: { domain: context.state.domain, id },
      relations: ['domain', 'userAccount', 'creator', 'updater']
    })
  }
}

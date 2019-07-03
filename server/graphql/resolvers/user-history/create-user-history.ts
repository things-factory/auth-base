import { getRepository } from 'typeorm'
import { UserHistory } from '../../../entities'

export const createUserHistory = {
  async createUserHistory(_: any, { userHistory }, context: any) {
    return await getRepository(UserHistory).save({
      domain: context.domain,
      creatorId: context.state.user.id,
      updaterId: context.state.user.id,
      ...userHistory
    })
  }
}

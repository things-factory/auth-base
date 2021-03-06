import { getRepository } from 'typeorm'
import { UserHistory } from '../../../entities'

export const updateUserHistory = {
  async updateUserHistory(_: any, { id, patch }, context: any) {
    const repository = getRepository(UserHistory)
    const userHistory = await repository.findOne({ domain: context.state.domain, id })

    return await repository.save({
      ...userHistory,
      ...patch,
      updater: context.state.user
    })
  }
}

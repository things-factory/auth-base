import { getRepository } from 'typeorm'
import { UserHistory } from '../../../entities'

export const deleteUserHistory = {
  async deleteUserHistory(_: any, { id }, context: any) {
    return await getRepository(UserHistory).delete({ domain: context.state.domain, id })
  }
}

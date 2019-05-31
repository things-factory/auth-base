import { getRepository } from 'typeorm'
import { Priviledge } from '../../../entities'

export const priviledgeResolver = {
  async priviledge(_, { id }, context, info) {
    const repository = getRepository(Priviledge)

    return await repository.findOne(
      { id }
    )
  }
}

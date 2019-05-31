import { getRepository } from 'typeorm'
import { Priviledge } from '../../../entities'

export const deletePriviledge = {
  async deletePriviledge(_, { id }) {
    const repository = getRepository(Priviledge)

    return await repository.delete(id)
  }
}

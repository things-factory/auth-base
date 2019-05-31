import { getRepository } from 'typeorm'
import { Priviledge } from '../../../entities'

export const updatePriviledge = {
  async updatePriviledge(_, { id, patch }) {
    const repository = getRepository(Priviledge)

    const priviledge = await repository.findOne({ id })

    return await repository.save({
      ...priviledge,
      ...patch
    })
  }
}

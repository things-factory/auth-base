import { getRepository } from 'typeorm'
import { Priviledge } from '../../../entities'

export const updatePriviledge = {
  async updatePriviledge(_: any, { name, patch }, context: any) {
    const repository = getRepository(Priviledge)
    const priviledge = await repository.findOne({ domain: context.domain, name })

    return await repository.save({
      ...priviledge,
      ...patch,
      updaterId: context.state.user.id
    })
  }
}

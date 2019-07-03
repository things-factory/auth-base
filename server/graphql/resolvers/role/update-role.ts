import { getRepository } from 'typeorm'
import { Role } from '../../../entities'

export const updateRole = {
  async updateRole(_: any, { name, patch }, context: any) {
    const repository = getRepository(Role)
    const role = await repository.findOne({ domain: context.domain, name })

    return await repository.save({
      ...role,
      ...patch,
      updaterId: context.state.user.id
    })
  }
}

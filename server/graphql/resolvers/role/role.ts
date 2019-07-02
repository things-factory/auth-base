import { getRepository } from 'typeorm'
import { Role } from '../../../entities'

export const roleResolver = {
  async role(_, { name }, context, info) {
    const repository = getRepository(Role)

    return await repository.findOne({
      where: { domain: context.domain, name },
      relations: ['domain', 'creator', 'updater']
    })
  }
}

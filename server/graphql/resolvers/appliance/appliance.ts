import { getRepository } from 'typeorm'
import { Appliance } from '../../../entities'

export const applianceResolver = {
  async appliance(_, { id }, context, info) {
    const repository = getRepository(Appliance)

    return await repository.findOne({
      where: { domain: context.domain, id },
      relations: ['domain', 'creator', 'updater']
    })
  }
}

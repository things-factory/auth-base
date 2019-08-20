import { getRepository } from 'typeorm'
import { Appliance } from '../../../entities'

export const updateAppliance = {
  async updateAppliance(_: any, { name, patch }, context: any) {
    const repository = getRepository(Appliance)
    const appliance = await repository.findOne({ where: { domain: context.domain, name } })

    return await repository.save({
      ...appliance,
      ...patch,
      updater: context.state.user
    })
  }
}

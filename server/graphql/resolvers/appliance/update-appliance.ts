import { getRepository } from 'typeorm'
import { Appliance } from '../../../entities'

export const updateAppliance = {
  async updateAppliance(_, { applianceId, patch }) {
    const repository = getRepository(Appliance)

    const appliance = await repository.findOne({ applianceId })

    return await repository.save({
      ...appliance,
      ...patch
    })
  }
}

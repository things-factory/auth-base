import { getRepository } from 'typeorm'
import { Appliance } from '../../../entities'

export const applianceResolver = {
  async appliance(_, { applianceId }, context, info) {
    const repository = getRepository(Appliance)

    return await repository.findOne({ applianceId })
  }
}

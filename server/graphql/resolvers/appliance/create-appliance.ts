import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'
import { Appliance } from '../../../entities'

export const createAppliance = {
  async createAppliance(_, { appliance: attrs }) {
    const repository = getRepository(Appliance)
    const newAppliance = {
      id: uuid(),
      ...attrs
    }

    return await repository.save(newAppliance)
  }
}

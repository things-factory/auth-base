import { getRepository } from 'typeorm'
import { Appliance } from '../../../entities'

export const deleteAppliance = {
  async deleteAppliance(_, { id }) {
    const repository = getRepository(Appliance)

    return await repository.delete(id)
  }
}

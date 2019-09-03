import { getRepository } from 'typeorm'
import { Appliance } from '../../../entities'

export const createAppliance = {
  async createAppliance(_: any, { appliance }, context: any) {
    return await getRepository(Appliance).save({
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user,
      ...appliance
    })
  }
}

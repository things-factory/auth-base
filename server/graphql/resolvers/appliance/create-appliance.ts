import { getRepository } from 'typeorm'
import { Appliance } from '../../../entities'

export const createAppliance = {
  async createAppliance(_: any, { appliance }, context: any) {
    return await getRepository(Appliance).save({
      domain: context.domain,
      creatorId: context.state.user.id,
      updaterId: context.state.user.id,
      ...appliance
    })
  }
}

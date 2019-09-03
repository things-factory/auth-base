import { getRepository } from 'typeorm'
import { Appliance } from '../../../entities'

export const deleteAppliance = {
  async deleteAppliance(_: any, { name }, context: any) {
    await getRepository(Appliance).delete({ domain: context.state.domain, name })
    return true
  }
}

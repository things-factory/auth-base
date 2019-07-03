import { getRepository } from 'typeorm'
import { Appliance } from '../../../entities'

export const deleteAppliance = {
  async deleteAppliance(_: any, { name }, context: any) {
    return await getRepository(Appliance).delete({ domain: context.domain, name })
  }
}

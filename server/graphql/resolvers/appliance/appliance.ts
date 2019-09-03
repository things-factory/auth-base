import { getRepository } from 'typeorm'
import { Appliance } from '../../../entities'

export const applianceResolver = {
  async appliance(_: any, { name }, context: any) {
    return await getRepository(Appliance).findOne({
      where: { domain: context.state.domain, name },
      relations: ['domain', 'creator', 'updater']
    })
  }
}

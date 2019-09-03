import { getRepository } from 'typeorm'
import { PermitUrl } from '../../../entities'

export const permitUrlResolver = {
  async permitUrl(_: any, { name }, context: any) {
    return await getRepository(PermitUrl).findOne({
      where: { domain: context.state.domain, name },
      relations: ['domain', 'creator', 'updater']
    })
  }
}

import { getRepository } from 'typeorm'
import { Role } from '../../../entities'

export const roleResolver = {
  async role(_: any, { name }, context: any) {
    return await getRepository(Role).findOne({
      where: { domain: context.domain, name },
      relations: ['domain', 'users', 'priviledges', 'creator', 'updater']
    })
  }
}

import { getRepository } from 'typeorm'
import { Priviledge } from '../../../entities'

export const priviledgeResolver = {
  async priviledge(_: any, { name }, context: any) {
    return await getRepository(Priviledge).findOne({
      where: { domain: context.state.domain, name },
      relations: ['domain', 'roles', 'creator', 'updater']
    })
  }
}

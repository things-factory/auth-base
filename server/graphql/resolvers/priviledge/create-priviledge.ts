import { getRepository } from 'typeorm'
import { Priviledge, Role } from '../../../entities'

export const createPriviledge = {
  async createPriviledge(_: any, { priviledge }, context: any) {
    if (priviledge.roles && priviledge.roles.length) {
      priviledge.roles = await getRepository(Role).findByIds(priviledge.roles)
    }

    return await getRepository(Priviledge).save({
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user,
      ...priviledge
    })
  }
}

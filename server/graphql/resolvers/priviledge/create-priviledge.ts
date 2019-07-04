import { getRepository } from 'typeorm'
import { Priviledge, Role } from '../../../entities'

export const createPriviledge = {
  async createPriviledge(_: any, { priviledge }, context: any) {
    if (priviledge.roles && priviledge.roles.length) {
      priviledge.roles = await getRepository(Role).findByIds(priviledge.roles)
    }

    return await getRepository(Priviledge).save({
      domain: context.domain,
      creatorId: context.state.user.id,
      updaterId: context.state.user.id,
      ...priviledge
    })
  }
}

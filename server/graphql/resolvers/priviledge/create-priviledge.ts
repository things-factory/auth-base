import { getRepository } from 'typeorm'
import { Priviledge } from '../../../entities'

export const createPriviledge = {
  async createPriviledge(_: any, { priviledge }, context: any) {
    return await getRepository(Priviledge).save({
      domain: context.domain,
      creatorId: context.state.user.id,
      updaterId: context.state.user.id,
      ...priviledge
    })
  }
}

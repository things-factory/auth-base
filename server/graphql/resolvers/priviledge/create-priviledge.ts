import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'
import { Priviledge } from '../../../entities'

export const createPriviledge = {
  async createPriviledge(_, { priviledge: attrs }) {
    const repository = getRepository(Priviledge)
    const newPriviledge = {
      id: uuid(),
      ...attrs
    }

    return await repository.save(newPriviledge)
  }
}

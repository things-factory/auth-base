import { getRepository } from 'typeorm'
import { Priviledge } from '../../../entities'

export const deletePriviledge = {
  async deletePriviledge(_: any, { name }, context: any) {
    return await getRepository(Priviledge).delete({ domain: context.domain, name })
  }
}

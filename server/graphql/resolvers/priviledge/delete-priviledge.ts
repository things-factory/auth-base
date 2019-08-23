import { getRepository } from 'typeorm'
import { Priviledge } from '../../../entities'

export const deletePriviledge = {
  async deletePriviledge(_: any, { name }, context: any) {
    await getRepository(Priviledge).delete({ domain: context.domain, name })
    return true
  }
}

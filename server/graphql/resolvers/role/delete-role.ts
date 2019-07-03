import { getRepository } from 'typeorm'
import { Role } from '../../../entities'

export const deleteRole = {
  async deleteRole(_: any, { name }, context: any) {
    return await getRepository(Role).delete({ domain: context.domain, name })
  }
}

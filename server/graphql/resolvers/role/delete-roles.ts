import { getRepository, In } from 'typeorm'
import { Role } from '../../../entities'

export const deleteRoles = {
  async deleteRoles(_: any, { names }, context: any) {
    await getRepository(Role).delete({
      domain: context.state.domain,
      name: In(names)
    })

    return true
  }
}

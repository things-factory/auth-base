import { getRepository } from 'typeorm'
import { Priviledge, Role, User } from '../../../entities'

export const createRole = {
  async createRole(_: any, { role }, context: any) {
    if (role.priviledges && role.priviledges.length) {
      role.priviledges = await getRepository(Priviledge).findByIds(role.priviledges)
    }

    if (role.users && role.users.length) {
      role.users = await getRepository(User).findByIds(role.users)
    }

    return await getRepository(Role).save({
      domain: context.domain,
      creatorId: context.state.user.id,
      updaterId: context.state.user.id,
      ...role
    })
  }
}

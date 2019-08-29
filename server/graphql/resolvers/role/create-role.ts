import { getRepository } from 'typeorm'
import { Priviledge, Role, User } from '../../../entities'
import { Domain } from '@things-factory/shell'

export const createRole = {
  async createRole(_: any, { role }, context: any) {
    if (role.priviledges && role.priviledges.length) {
      role.priviledges = await getRepository(Priviledge).findByIds(role.priviledges.map(priviledge => priviledge.id))
    }

    if (role.users && role.users.length) {
      role.users = await getRepository(User).findByIds(role.users.map(user => user.id))
    }

    role.domain = await getRepository(Domain).findOne(role.domain.id)

    return await getRepository(Role).save({
      updater: context.state.user,
      creator: context.state.user,
      ...role
    })
  }
}

import { Domain } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Role, User } from '../../../entities'

export const createUser = {
  async createUser(_: any, { user }, context: any) {
    if (user.roles && user.roles.length) {
      user.roles = await getRepository(Role).findByIds(user.roles)
    }

    user.domain = await getRepository(Domain).findOne(user.domain.id)

    return await getRepository(User).save({
      creator: context.state.user,
      updater: context.state.user,
      ...user,
      password: user.password ? User.encode(user.password) : null
    })
  }
}

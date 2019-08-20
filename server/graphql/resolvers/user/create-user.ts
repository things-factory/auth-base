import { getRepository } from 'typeorm'
import { User, Role } from '../../../entities'

export const createUser = {
  async createUser(_: any, { user }, context: any) {
    if (user.roles && user.roles.length) {
      user.roles = await getRepository(Role).findByIds(user.roles)
    }

    return await getRepository(User).save({
      domain: context.domain,
      creator: context.state.user,
      updater: context.state.user,
      ...user,
      password: user.password ? User.encode(user.password) : null
    })
  }
}

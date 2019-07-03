import { getRepository } from 'typeorm'
import { User, Role } from '../../../entities'

export const createUser = {
  async createUser(_: any, { user }, context: any) {
    if (user.roles && user.roles.length) {
      user.roles = await getRepository(Role).findByIds(user.roles)
    }

    return await getRepository(User).save({
      creatorId: context.state.user.id,
      updaterId: context.state.user.id,
      ...user,
      password: user.password ? User.encode(user.password) : null
    })
  }
}

import { getRepository } from 'typeorm'
import { Role, User } from '../../../entities'

export const updateUser = {
  async updateUser(_: any, { email, patch }, context: any) {
    const repository = getRepository(User)
    const user = await repository.findOne({
      where: { email },
      relations: ['domain', 'roles']
    })

    patch.roles = await getRepository(Role).findByIds(patch.roles.map(role => role.id))
    if (patch.roles.length === 0) {
      delete patch.roles
      delete user.roles
    }

    return await repository.save({
      ...user,
      ...patch,
      updater: context.state.user
    })
  }
}

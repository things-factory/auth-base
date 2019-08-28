import { getRepository } from 'typeorm'
import { Role, User } from '../../../entities'

export const updateUser = {
  async updateUser(_: any, { email, patch }, context: any) {
    const repository = getRepository(User)
    const user = await repository.findOne({
      where: { email },
      relations: ['domain', 'domains', 'roles']
    })

    return await repository.save({
      ...user,
      ...patch,
      roles: await getRepository(Role).findByIds(patch.roles.map((role: Role) => role.id)),
      updater: context.state.user
    })
  }
}

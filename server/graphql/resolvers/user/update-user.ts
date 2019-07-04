import { getRepository } from 'typeorm'
import { Role, User } from '../../../entities'

export const updateUser = {
  async updateUser(_: any, { email, patch }, context: any) {
    const repository = getRepository(User)
    const user = await repository.findOne({
      where: { email },
      relations: ['roles']
    })

    const roleIds = user.roles.map(role => role.id)
    if (patch.roles && patch.roles.length) {
      patch.roles.forEach((roleId: string) => {
        if (!roleIds.includes(roleId)) {
          roleIds.push(roleId)
        }
      })
    }

    return await repository.save({
      ...user,
      ...patch,
      roles: await getRepository(Role).findByIds(roleIds),
      updaterId: context.state.user.id
    })
  }
}

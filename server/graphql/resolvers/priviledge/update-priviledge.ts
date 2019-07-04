import { getRepository } from 'typeorm'
import { Priviledge, Role } from '../../../entities'

export const updatePriviledge = {
  async updatePriviledge(_: any, { name, patch }, context: any) {
    const repository = getRepository(Priviledge)
    const priviledge = await repository.findOne({
      where: { domain: context.domain, name },
      relations: ['domain', 'roles', 'creator', 'updater']
    })

    const roleIds = priviledge.roles.map(role => role.id)
    if (patch.roles && patch.roles.length) {
      patch.roles.forEach((roleId: string) => {
        if (!roleIds.includes(roleId)) {
          roleIds.push(roleId)
        }
      })
    }

    return await repository.save({
      ...priviledge,
      ...patch,
      roles: await getRepository(Role).findByIds(roleIds),
      updaterId: context.state.user.id
    })
  }
}

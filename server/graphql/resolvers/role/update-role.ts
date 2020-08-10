import { getRepository } from 'typeorm'
import { Privilege, Role } from '../../../entities'

export const updateRole = {
  async updateRole(_: any, { id, patch }, context: any) {
    const repository = getRepository(Role)
    const role = await repository.findOne({
      where: { id },
      relations: ['domain', 'privileges', 'creator', 'updater']
    })

    const privilegeIds = role.privileges.map(privilege => privilege.id)
    if (patch.privileges && patch.privileges.length) {
      patch.privileges.forEach((privilegeId: string) => {
        if (!privilegeIds.includes(privilegeId)) {
          privilegeIds.push(privilegeId)
        }
      })
    }

    return await repository.save({
      ...role,
      ...patch,
      privileges: await getRepository(Privilege).findByIds(
        patch.privileges.map((privilege: Privilege) => privilege.id)
      ),
      updater: context.state.user
    })
  }
}

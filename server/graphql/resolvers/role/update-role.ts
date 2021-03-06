import { getRepository } from 'typeorm'
import { Priviledge, Role } from '../../../entities'

export const updateRole = {
  async updateRole(_: any, { id, patch }, context: any) {
    const repository = getRepository(Role)
    const role = await repository.findOne({
      where: { id },
      relations: ['domain', 'priviledges', 'creator', 'updater']
    })

    const priviledgeIds = role.priviledges.map(priviledge => priviledge.id)
    if (patch.priviledges && patch.priviledges.length) {
      patch.priviledges.forEach((priviledgeId: string) => {
        if (!priviledgeIds.includes(priviledgeId)) {
          priviledgeIds.push(priviledgeId)
        }
      })
    }

    return await repository.save({
      ...role,
      ...patch,
      priviledges: await getRepository(Priviledge).findByIds(
        patch.priviledges.map((priviledge: Priviledge) => priviledge.id)
      ),
      updater: context.state.user
    })
  }
}

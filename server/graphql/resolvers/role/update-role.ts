import { getRepository } from 'typeorm'
import { Priviledge, Role } from '../../../entities'

export const updateRole = {
  async updateRole(_: any, { name, patch }, context: any) {
    const repository = getRepository(Role)
    const role = await repository.findOne({
      where: { domain: context.domain, name },
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
      priviledges: await getRepository(Priviledge).findByIds(priviledgeIds),
      updater: context.state.user
    })
  }
}

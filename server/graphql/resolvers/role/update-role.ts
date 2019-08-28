import { getRepository, In } from 'typeorm'
import { Priviledge, Role, User } from '../../../entities'

export const updateRole = {
  async updateRole(_: any, { name, patch }, context: any) {
    const repository = getRepository(Role)
    const role = await repository.findOne({
      where: { domain: context.domain, name },
      relations: ['domain', 'users', 'priviledges', 'creator', 'updater']
    })

    const userEmails = role.users.map(user => user.email)
    if (patch.users && patch.users.length) {
      patch.users.forEach((userEmail: string) => {
        if (!userEmails.includes(userEmail)) {
          userEmails.push(userEmail)
        }
      })
    }

    const priviledgeIds = role.priviledges.map(priviledge => priviledge.id)
    if (patch.priviledges && patch.priviledges.length) {
      patch.priviledges.forEach((priviledgeId: number) => {
        if (!priviledgeIds.includes(priviledgeId)) {
          priviledgeIds.push(priviledgeId)
        }
      })
    }

    return await repository.save({
      ...role,
      ...patch,
      users: await getRepository(User).find({ email: In(userEmails) }),
      priviledges: await getRepository(Priviledge).findByIds(priviledgeIds),
      updater: context.state.user
    })
  }
}

import { getRepository } from 'typeorm'
import { Privilege, Role } from '../../../entities'
import { Domain } from '@things-factory/domain-base'

export const updatePrivilege = {
  async updatePrivilege(_: any, { name, patch }, context: any) {
    const repository = getRepository(Privilege)
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }
    const privilege = await repository.findOne({
      where: { domain: context.state.domainEntity, name },
      relations: ['domain', 'roles', 'creator', 'updater']
    })

    const roleIds = privilege.roles.map(role => role.id)
    if (patch.roles && patch.roles.length) {
      patch.roles.forEach((roleId: string) => {
        if (!roleIds.includes(roleId)) {
          roleIds.push(roleId)
        }
      })
    }

    return await repository.save({
      ...privilege,
      ...patch,
      roles: await getRepository(Role).findByIds(roleIds),
      updater: context.state.user
    })
  }
}

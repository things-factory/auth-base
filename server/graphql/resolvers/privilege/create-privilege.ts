import { getRepository } from 'typeorm'
import { Privilege, Role } from '../../../entities'
import { Domain } from '@things-factory/domain-base'

export const createPrivilege = {
  async createPrivilege(_: any, { privilege }, context: any) {
    if (privilege.roles && privilege.roles.length) {
      privilege.roles = await getRepository(Role).findByIds(privilege.roles)
    }

    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }

    return await getRepository(Privilege).save({
      domain: context.state.domainEntity,
      creator: context.state.user,
      updater: context.state.user,
      ...privilege
    })
  }
}

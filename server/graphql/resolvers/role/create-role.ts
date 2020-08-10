import { getRepository } from 'typeorm'
import { Privilege, Role, User } from '../../../entities'
import { Domain } from '@things-factory/domain-base'

export const createRole = {
  async createRole(_: any, { role }, context: any) {
    if (role.privileges && role.privileges.length) {
      role.privileges = await getRepository(Privilege).findByIds(role.privileges.map(privilege => privilege.id))
    }

    if (role.users && role.users.length) {
      role.users = await getRepository(User).findByIds(role.users.map(user => user.id))
    }

    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }

    return await getRepository(Role).save({
      domain: context.state.domainEntity,
      updater: context.state.user,
      creator: context.state.user,
      ...role
    })
  }
}

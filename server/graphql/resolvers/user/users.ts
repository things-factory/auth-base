import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { User } from '../../../entities'

export const usersResolver = {
  async users(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(User).createQueryBuilder()
    buildQuery(queryBuilder, params, context, !context.domain.systemFlag)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('User.roles', 'Roles')
      .leftJoinAndSelect('User.domain', 'Domain')
      .leftJoinAndSelect('Roles.priviledges', 'Priviledges')
      .leftJoinAndSelect('Roles.users', 'Users')
      .getManyAndCount()

    return { items, total }
  }
}

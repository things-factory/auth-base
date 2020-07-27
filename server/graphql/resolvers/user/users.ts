import { buildQuery, ListParam } from '@things-factory/graphql-utils'
import { getRepository } from 'typeorm'
import { User } from '../../../entities'

export const usersResolver = {
  async users(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(User).createQueryBuilder()
    buildQuery(queryBuilder, params, context)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('User.roles', 'Roles')
      .leftJoinAndSelect('User.domain', 'Domain')
      .leftJoinAndSelect('User.domains', 'Domains')
      .leftJoinAndSelect('Roles.priviledges', 'Priviledges')
      .leftJoinAndSelect('Roles.users', 'Users')
      .getManyAndCount()

    return { items, total }
  }
}

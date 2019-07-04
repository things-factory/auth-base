import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { User } from '../../../entities'

export const usersResolver = {
  async users(_: any, params: ListParam) {
    const queryBuilder = getRepository(User).createQueryBuilder()
    buildQuery(queryBuilder, params)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('User.roles', 'Roles')
      .leftJoinAndSelect('Roles.priviledges', 'Priviledges')
      .leftJoinAndSelect('Roles.users', 'Users')
      .getManyAndCount()

    return { items, total }
  }
}

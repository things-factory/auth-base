import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Role } from '../../../entities'

export const rolesResolver = {
  async roles(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(Role).createQueryBuilder()
    buildQuery(queryBuilder, params, context)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('Role.domain', 'Domain')
      .leftJoinAndSelect('Role.users', 'Users')
      .leftJoinAndSelect('Role.priviledges', 'Priviledges')
      .leftJoinAndSelect('Role.creator', 'Creator')
      .leftJoinAndSelect('Role.updater', 'Updater')
      .getManyAndCount()

    return { items, total }
  }
}

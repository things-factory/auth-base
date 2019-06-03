import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Role } from '../../../entities'

export const rolesResolver = {
  async roles(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(Role).createQueryBuilder()
    buildQuery(queryBuilder, params)
    const [items, total] = await queryBuilder.getManyAndCount()

    return { items, total }
  }
}

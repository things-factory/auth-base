import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { User } from '../../../entities'

export const usersResolver = {
  async users(_: any, params: ListParam) {
    const queryBuilder = getRepository(User).createQueryBuilder()
    buildQuery(queryBuilder, params)
    const [items, total] = await queryBuilder.getManyAndCount()

    return { items, total }
  }
}

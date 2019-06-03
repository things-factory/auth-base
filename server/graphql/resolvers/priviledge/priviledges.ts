import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Priviledge } from '../../../entities'

export const priviledgesResolver = {
  async priviledges(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(Priviledge).createQueryBuilder()
    buildQuery(queryBuilder, params)
    const [items, total] = await queryBuilder.getManyAndCount()

    return { items, total }
  }
}

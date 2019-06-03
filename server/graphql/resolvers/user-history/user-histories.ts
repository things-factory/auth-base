import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { UserHistory } from '../../../entities'

export const userHistoriesResolver = {
  async userHistories(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(UserHistory).createQueryBuilder()
    buildQuery(queryBuilder, params)
    const [items, total] = await queryBuilder.getManyAndCount()

    return { items, total }
  }
}

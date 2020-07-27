import { buildQuery, ListParam } from '@things-factory/graphql-utils'
import { getRepository } from 'typeorm'
import { UserHistory } from '../../../entities'

export const userHistoriesResolver = {
  async userHistories(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(UserHistory).createQueryBuilder()
    buildQuery(queryBuilder, params, context)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('UserHistory.domain', 'Domain')
      .leftJoinAndSelect('UserHistory.userAccount', 'UserAccount')
      .leftJoinAndSelect('UserHistory.creator', 'Creator')
      .leftJoinAndSelect('UserHistory.updater', 'Updater')
      .getManyAndCount()

    return { items, total }
  }
}

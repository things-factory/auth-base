import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Appliance } from '../../../entities'

export const appliancesResolver = {
  async appliances(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(Appliance).createQueryBuilder()
    buildQuery(queryBuilder, params)
    const [items, total] = await queryBuilder.getManyAndCount()

    return { items, total }
  }
}

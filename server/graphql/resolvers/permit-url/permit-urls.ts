import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { PermitUrl } from '../../../entities'

export const permitUrlsResolver = {
  async permitUrls(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(PermitUrl).createQueryBuilder()
    buildQuery(queryBuilder, params)
    const [items, total] = await queryBuilder.getManyAndCount()

    return { items, total }
  }
}

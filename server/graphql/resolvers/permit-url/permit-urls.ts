import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { PermitUrl } from '../../../entities'

export const permitUrlsResolver = {
  async permitUrls(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(PermitUrl).createQueryBuilder()
    buildQuery(queryBuilder, params, context)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('PermitUrl.domain', 'Domain')
      .leftJoinAndSelect('PermitUrl.creator', 'Creator')
      .leftJoinAndSelect('PermitUrl.updater', 'Updater')
      .getManyAndCount()

    return { items, total }
  }
}

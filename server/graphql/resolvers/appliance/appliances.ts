import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Appliance } from '../../../entities'

export const appliancesResolver = {
  async appliances(_: any, params: ListParam) {
    const queryBuilder = getRepository(Appliance).createQueryBuilder()
    buildQuery(queryBuilder, params)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('Appliance.domain', 'Domain')
      .leftJoinAndSelect('Appliance.creator', 'Creator')
      .leftJoinAndSelect('Appliance.updater', 'Updater')
      .getManyAndCount()

    return { items, total }
  }
}

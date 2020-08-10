import { buildQuery, ListParam } from '@things-factory/graphql-utils'
import { getRepository } from 'typeorm'
import { Privilege } from '../../../entities'

export const privilegesResolver = {
  async privileges(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(Privilege).createQueryBuilder()
    buildQuery(queryBuilder, params, context)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('Privilege.domain', 'Domain')
      .leftJoinAndSelect('Privilege.roles', 'Role')
      .leftJoinAndSelect('Privilege.creator', 'Creator')
      .leftJoinAndSelect('Privilege.updater', 'Updater')
      .getManyAndCount()

    return { items, total }
  }
}

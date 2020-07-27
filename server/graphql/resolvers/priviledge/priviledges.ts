import { buildQuery, ListParam } from '@things-factory/graphql-utils'
import { getRepository } from 'typeorm'
import { Priviledge } from '../../../entities'

export const priviledgesResolver = {
  async priviledges(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(Priviledge).createQueryBuilder()
    buildQuery(queryBuilder, params, context)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('Priviledge.domain', 'Domain')
      .leftJoinAndSelect('Priviledge.roles', 'Role')
      .leftJoinAndSelect('Priviledge.creator', 'Creator')
      .leftJoinAndSelect('Priviledge.updater', 'Updater')
      .getManyAndCount()

    return { items, total }
  }
}

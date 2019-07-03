import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Priviledge } from '../../../entities'

export const priviledgesResolver = {
  async priviledges(_: any, params: ListParam) {
    const queryBuilder = getRepository(Priviledge).createQueryBuilder()
    buildQuery(queryBuilder, params)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('Priviledge.domain', 'Domain')
      .leftJoinAndSelect('Priviledge.roles', 'Role')
      .leftJoinAndSelect('Priviledge.creator', 'Creator')
      .leftJoinAndSelect('Priviledge.updater', 'Updater')
      .getManyAndCount()

    return { items, total }
  }
}

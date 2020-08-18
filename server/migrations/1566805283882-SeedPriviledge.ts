import { Domain } from '@things-factory/shell'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { Priviledge } from '../entities'

const SEEDS_PRIVILEDGES = [
  {
    name: 'query',
    category: 'user',
    description: 'to read user data'
  },
  {
    name: 'mutation',
    category: 'user',
    description: 'to edit user data'
  }
]

export class SeedPriviledge1566805283882 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const domains = await getRepository(Domain).find()

    return Promise.all(
      domains.map(async domain =>
        Promise.all(
          SEEDS_PRIVILEDGES.map(async (priviledge: Priviledge) => {
            await getRepository(Priviledge).save({
              ...priviledge,
              domain
            })
          })
        )
      )
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const domains = await getRepository(Domain).find()

    return Promise.all(
      domains.map(async domain =>
        Promise.all(
          SEEDS_PRIVILEDGES.map(async (priviledge: Priviledge) => {
            await getRepository(Priviledge).delete({
              ...priviledge,
              domain
            })
          })
        )
      )
    )
  }
}

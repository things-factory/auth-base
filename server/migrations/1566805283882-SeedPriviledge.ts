import { Domain } from '@things-factory/domain-base'
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

    try {
      for (let i = 0; i < domains.length; i++) {
        const domain = domains[i]

        for (let j = 0; j < SEEDS_PRIVILEDGES.length; j++) {
          const priviledge: any = SEEDS_PRIVILEDGES[j]
          priviledge.domain = domain

          await getRepository(Priviledge).save({
            ...priviledge
          })
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Priviledge)

    SEEDS_PRIVILEDGES.reverse().forEach(async priviledge => {
      let record = await repository.findOne({ name: priviledge.name })
      await repository.remove(record)
    })
  }
}

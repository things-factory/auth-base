import { Domain } from '@things-factory/shell'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { Priviledge } from '../entities'

const SEEDS_PRIVILEDGE = [
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
    const repository = getRepository(Priviledge)
    const domain = await getRepository(Domain).findOne({ where: { name: 'SYSTEM' } })

    try {
      for (let i = 0; i < SEEDS_PRIVILEDGE.length; i++) {
        const priviledge = SEEDS_PRIVILEDGE[i]
        await repository.save({
          domain,
          ...priviledge
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Priviledge)

    SEEDS_PRIVILEDGE.reverse().forEach(async priviledge => {
      let record = await repository.findOne({ name: priviledge.name })
      await repository.remove(record)
    })
  }
}

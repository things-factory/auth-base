import { Domain } from '@things-factory/domain-base'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { Privilege } from '../entities'

const SEEDS_PRIVILEGES = [
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

export class SeedPrivilege1566805283882 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const domains = await getRepository(Domain).find()

    try {
      for (let i = 0; i < domains.length; i++) {
        const domain = domains[i]

        for (let j = 0; j < SEEDS_PRIVILEGES.length; j++) {
          const privilege: any = SEEDS_PRIVILEGES[j]
          privilege.domain = domain

          await getRepository(Privilege).save({
            ...privilege
          })
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Privilege)

    SEEDS_PRIVILEGES.reverse().forEach(async privilege => {
      let record = await repository.findOne({ name: privilege.name })
      await repository.remove(record)
    })
  }
}

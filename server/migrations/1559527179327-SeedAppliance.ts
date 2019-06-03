import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { Appliance } from '../entities'

const SEED = []

export class SeedAppliance1559527179327 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Appliance)
    const domainRepository = getRepository(Domain)
    const domain = await domainRepository.findOne({
      name: 'SYSTEM'
    })

    try {
      SEED.forEach(async appliance => {
        await repository.save({
          ...appliance,
          domain
        })
      })
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Appliance)
    SEED.reverse().forEach(async appliance => {
      let record = await repository.findOne({ name: appliance.name })
      await repository.remove(record)
    })
  }
}

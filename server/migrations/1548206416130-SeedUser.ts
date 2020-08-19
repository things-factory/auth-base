import { Domain } from '@things-factory/shell'
import { config } from '@things-factory/env'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { User, UserStatus } from '../entities'

const ADMIN_ACCOUNT = config.get('adminAccount', {
  name: 'Admin',
  email: 'admin@hatiolab.com',
  password: 'admin'
})

const SEED_USERS = [
  {
    ...ADMIN_ACCOUNT,
    userType: 'admin',
    status: UserStatus.ACTIVATED
  }
]

export class SeedUsers1525758367829 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(User)
    const domain = await getRepository(Domain).findOne({ where: { name: 'SYSTEM' } })

    return Promise.all(
      SEED_USERS.map(async user => {
        await repository.save({
          ...user,
          password: User.encode(user.password)
        })

        const userFetch = await repository.findOne({
          email: user.email
        })

        userFetch.domain = Promise.resolve(domain)
        userFetch.domains = Promise.resolve([domain])

        await repository.save(userFetch)
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(User)

    return Promise.all(
      SEED_USERS.reverse().map(async user => {
        let record = await repository.findOne({ email: user.email })
        await repository.remove(record)
      })
    )
  }
}

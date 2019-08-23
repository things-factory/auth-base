import { MigrationInterface, QueryRunner, Repository } from 'typeorm'
import { getRepository } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { User } from '../entities'

const SEED_USERS = [
  {
    name: 'Admin',
    email: 'admin@hatiolab.com',
    password: 'admin',
    userType: 'admin'
  }
]

export class SeedUsers1525758367829 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(User)
    const domain = await getRepository(Domain).findOne({ where: { name: 'SYSTEM' } })

    try {
      for (let i = 0; i < SEED_USERS.length; i++) {
        const user = SEED_USERS[i]
        await repository.save({
          domain,
          ...user,
          password: User.encode(user.password)
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(User)

    SEED_USERS.reverse().forEach(async user => {
      let record = await repository.findOne({ email: user.email })
      await repository.remove(record)
    })
  }
}

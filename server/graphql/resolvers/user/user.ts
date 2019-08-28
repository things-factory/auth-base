import { getRepository } from 'typeorm'
import { User } from '../../../entities'

export const userResolver = {
  async user(_: any, { email }) {
    return await getRepository(User).findOne({
      where: { email },
      relations: ['domain', 'domains', 'roles']
    })
  }
}

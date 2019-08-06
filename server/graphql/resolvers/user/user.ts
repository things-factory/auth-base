import { getRepository } from 'typeorm'
import { User } from '../../../entities'

export const userResolver = {
  async user(_: any, { email }, context: any) {
    return await getRepository(User).findOne({
      where: { domain: context.domain, email },
      relations: ['domain', 'roles']
    })
  }
}

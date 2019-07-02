import { getRepository } from 'typeorm'
import { User } from '../../../entities'

export const userResolver = {
  async user(_, { email }, context, info) {
    const repository = getRepository(User)

    return await repository.findOne({
      where: { domain: context.domain, email }
    })
  }
}

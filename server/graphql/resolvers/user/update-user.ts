import { getRepository } from 'typeorm'
import { User } from '../../../entities'

export const updateUser = {
  async updateUser(_: any, { email, patch }, context: any) {
    const repository = getRepository(User)
    const user = await repository.findOne({ email })

    return await repository.save({
      ...user,
      ...patch,
      updaterId: context.state.user.id
    })
  }
}

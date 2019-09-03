import { getRepository, In } from 'typeorm'
import { User } from '../../../entities'

export const deleteUsers = {
  async deleteUsers(_: any, { emails }, context: any) {
    await getRepository(User).delete({
      domain: context.state.domain,
      email: In(emails)
    })

    return true
  }
}

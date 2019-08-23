import { getRepository } from 'typeorm'
import { User } from '../../../entities'

export const deleteUser = {
  async deleteUser(_: any, { email }, context: any) {
    await getRepository(User).delete({ domain: context.domain, email })
    return true
  }
}

import { getRepository } from 'typeorm'
import { User } from '../../../entities'

export const deleteUser = {
  async deleteUser(_: any, { email }) {
    return await getRepository(User).delete({ email })
  }
}

import { getRepository } from 'typeorm'
import { User } from '../../../entities'

export const userResolver = {
  async user(_: any, { email }, context: any) {
    const systemFlag = context && context.domain && context.domain.systemFlag
    let where = {}
    if (!systemFlag) {
      where = { domain: context.domain }
    }
    return await getRepository(User).findOne({
      where: { ...where, email },
      relations: ['domain', 'roles']
    })
  }
}

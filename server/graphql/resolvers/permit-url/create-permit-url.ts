import { getRepository } from 'typeorm'
import { PermitUrl } from '../../../entities'

export const createPermitUrl = {
  async createPermitUrl(_: any, { permitUrl }, context: any) {
    return await getRepository(PermitUrl).save({
      domain: context.domain,
      creator: context.state.user,
      updater: context.state.user,
      ...permitUrl
    })
  }
}

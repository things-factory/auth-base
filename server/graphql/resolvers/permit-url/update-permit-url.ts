import { getRepository } from 'typeorm'
import { PermitUrl } from '../../../entities'

export const updatePermitUrl = {
  async updatePermitUrl(_: any, { name, patch }, context: any) {
    const repository = getRepository(PermitUrl)
    const permitUrl = await repository.findOne({ where: { domain: context.state.domain, name } })

    return await repository.save({
      ...permitUrl,
      ...patch,
      updater: context.state.user
    })
  }
}

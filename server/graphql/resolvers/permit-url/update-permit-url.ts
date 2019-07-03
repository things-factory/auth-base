import { getRepository } from 'typeorm'
import { PermitUrl } from '../../../entities'

export const updatePermitUrl = {
  async updatePermitUrl(_: any, { name, patch }, context: any) {
    const repository = getRepository(PermitUrl)
    const permitUrl = await repository.findOne({ where: { domain: context.domain, name } })

    return await repository.save({
      ...permitUrl,
      ...patch,
      updaterId: context.state.user.id
    })
  }
}

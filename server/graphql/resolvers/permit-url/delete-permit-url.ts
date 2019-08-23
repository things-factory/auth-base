import { getRepository } from 'typeorm'
import { PermitUrl } from '../../../entities'

export const deletePermitUrl = {
  async deletePermitUrl(_: any, { name }, context: any) {
    await getRepository(PermitUrl).delete({ domain: context.domain, name })
    return true
  }
}

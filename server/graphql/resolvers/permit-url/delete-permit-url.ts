import { getRepository } from 'typeorm'
import { PermitUrl } from '../../../entities'

export const deletePermitUrl = {
  async deletePermitUrl(_: any, { name }, context: any) {
    return getRepository(PermitUrl).delete({ domain: context.domain, name })
  }
}

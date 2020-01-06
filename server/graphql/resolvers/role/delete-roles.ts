import { getRepository } from 'typeorm'
import { Role } from '../../../entities'

export const deleteRoles = {
  async deleteRoles(_: any, { ids }, _context: any) {
    await getRepository(Role).delete(ids)
    return true
  }
}

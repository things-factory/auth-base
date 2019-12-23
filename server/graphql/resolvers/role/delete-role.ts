import { getRepository } from 'typeorm'
import { Role } from '../../../entities'

export const deleteRole = {
  async deleteRole(_: any, { id }, _context: any) {
    await getRepository(Role).delete(id)
    return true
  }
}

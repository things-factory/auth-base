import { deleteAccount } from '../../../controllers/delete-account'

export const deleteUser = {
  async deleteUser(_: any, { email }, context: any) {
    await deleteAccount({ email })

    return true
  }
}

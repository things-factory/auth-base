import { deleteAccounts } from '../../../controllers/delete-account'

export const deleteUsers = {
  async deleteUsers(_: any, { emails }, context: any) {
    await deleteAccounts({ emails })

    return true
  }
}

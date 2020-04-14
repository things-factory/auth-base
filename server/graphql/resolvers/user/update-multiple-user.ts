import { getConnection } from 'typeorm'
import { User } from '../../../entities'

export const updateMultipleUser = {
  async updateMultipleUser(_: any, { patches }, context: any) {
    let results = []
    const _createRecords = patches.filter((patch: any) => patch.cuFlag.toUpperCase() === '+')
    const _updateRecords = patches.filter((patch: any) => patch.cuFlag.toUpperCase() === 'M')

    await getConnection().transaction(async (txManager) => {
      const userRepo = txManager.getRepository(User)
      if (_createRecords.length > 0) {
        for (let i = 0; i < _createRecords.length; i++) {
          const newRecord = _createRecords[i]

          const result = await userRepo.save({
            ...newRecord,
            password: User.encode(newRecord.password),
            domain: context.state.domain,
            creator: context.state.user,
            updater: context.state.user,
          })

          // repository api는 작동하지 않음.
          await txManager
            .createQueryBuilder()
            .insert()
            .into('users_domains')
            .values({
              usersId: result.id,
              domainsId: newRecord.domain.id,
            })
            .execute()

          results.push({ ...result, cuFlag: '+' })
        }
      }

      if (_updateRecords.length > 0) {
        for (let i = 0; i < _updateRecords.length; i++) {
          const newRecord = _updateRecords[i]
          const user = await userRepo.findOne(newRecord.id)

          const result = await userRepo.save({
            ...user,
            ...newRecord,
            password: newRecord.password ? User.encode(newRecord.password) : user.password,
            updater: context.state.user,
          })

          if (newRecord.domain) {
            // repository api는 작동하지 않음.
            await txManager
              .createQueryBuilder()
              .update('users_domains')
              .set({
                domainsId: newRecord.domain.id,
              })
              .where({
                usersId: user.id,
              })
              .execute()
          }

          results.push({ ...result, cuFlag: 'M' })
        }
      }
    })

    return results
  },
}

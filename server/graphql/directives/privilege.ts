import { Domain } from '@things-factory/domain-base'
import { getRepository } from 'typeorm'
import { User } from '../../entities'

export const directivePrivilege = {
  async privilege(next, root, args, context, info) {
    if (!context.state.domainEntity)
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })

    if (context?.state?.domainEntity?.systemFlag) return next()

    const result = await getRepository(User).query(
      `
        SELECT
          COUNT(1) AS has_privilege
        FROM
          privileges
        WHERE
          category = '${args.category}'
        AND
          name = '${args.privilege}'
        AND
          id
        IN (
          SELECT
            RP.privileges_id
          FROM
            users_roles UR
          INNER JOIN
            roles_privileges RP
          ON
            UR.roles_id = RP.roles_id
          WHERE
            UR.users_id = '${context.state.user.id}'
        )
      `
    )

    if (result[0].has_privilege > 0) {
      return next()
    } else {
      throw new Error(`Unauthorized!`)
    }
  }
}

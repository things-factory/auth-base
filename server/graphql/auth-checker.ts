import { Domain } from '@things-factory/domain-base'
import { User } from '../entities'
import { AuthChecker } from 'type-graphql'
import { Context } from 'koa'

export interface PrivilegeOption {
  category: string
  privilege: string
}

// create auth checker function
export const authChecker: AuthChecker<Context, PrivilegeOption> = async ({ context }, roles?: PrivilegeOption[]) => {
  const { user, domain: domainName } = context.state
  if (!roles?.length) {
    // if `@Authorized()`, check only is user exist
    return user !== undefined
  }
  // there are some roles defined now

  if (!user) {
    // and if no user, restrict access
    return false
  }

  if (!context?.state?.domainEntity) context.state.domainEntity = await Domain.findOne({ subdomain: domainName })

  if (context?.state?.domainEntity?.systemFlag) return true

  const role = roles[0]

  const result = await User.query(
    `
      SELECT
        COUNT(1) AS has_privilege
      FROM
        privileges
      WHERE
        category = '${role.category}'
      AND
        name = '${role.privilege}'
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
          UR.users_id = '${user?.id}'
      )
    `
  )

  if (result[0].has_privilege > 0) return true
  else return false
}

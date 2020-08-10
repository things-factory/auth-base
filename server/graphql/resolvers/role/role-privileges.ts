import { getRepository } from 'typeorm'
import { Privilege } from '../../../entities'
import { Domain } from '@things-factory/domain-base'

export const rolePrivilegesResolver = {
  async rolePrivileges(_: any, { roleId }, context: any) {
    if (!context.state.domainEntity) {
      context.state.domainEntity = await Domain.findOne({ subdomain: context.state.domain })
    }
    const rolePrivileges = await getRepository(Privilege).query(
      `
        SELECT
          id,
          name,
          category,
          description,
          CASE WHEN id IN (
            SELECT
              P.id
            FROM
              privileges P JOIN roles_privileges RP
            ON
              P.id = RP.privileges_id
            WHERE
              RP.roles_id = '${roleId}'
          ) THEN true
            ELSE false
          END AS assigned
        FROM
          privileges
        WHERE
            domain_id = '${context.state.domainEntity.id}'
      `
    )

    return rolePrivileges
  }
}

import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository, EntityManager } from 'typeorm'
import { Role } from '../../../entities'

export const userRolesResolver = {
  async userRoles(_: any, {}, context: any) {
    const em = new EntityManager(getRepository(Role).metadata.connection)
    const userRoles = await em.query(
      `
      SELECT
        id,
        name,
        description,
        CASE WHEN id IN (
          SELECT
            R.id
          FROM
            roles R JOIN users_roles UR
          ON
            R.id = UR.roles_id
          WHERE
            UR.users_id = :userId
        ) THEN true
          ELSE false
        END AS assigned
      FROM
        roles
    `,
      [context.state && context.state.user && context.state.user.id]
    )

    return userRoles
  }
}

import { getRepository } from 'typeorm'
import { Priviledge } from '../../../entities'

export const rolePriviledgesResolver = {
  async rolePriviledges(_: any, { roleId }) {
    const rolePriviledges = await getRepository(Priviledge).query(
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
              priviledges P JOIN roles_priviledges RP
            ON
              P.id = RP.priviledges_id
            WHERE
              RP.roles_id = '${roleId}'
          ) THEN true
            ELSE false
          END AS assigned
        FROM
          priviledges
      `
    )

    return rolePriviledges
  }
}

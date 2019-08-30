import { getRepository } from 'typeorm'
import { User } from '../../../entities'

export const directivePriviledge = {
  async priviledge(next, root, args, context, info) {
    if (context && context.domain && context.domain.systemFlag) {
      return next()
    }

    const result = await getRepository(User).query(
      `
        SELECT 
          COUNT(1) AS hasPriviledge
        FROM
          priviledges
        WHERE
          category = '${args.category}'
        AND
          name = '${args.priviledge}'
        AND
          id
        IN (
          SELECT
            RP.priviledges_id
          FROM
            users_roles UR
          INNER JOIN
            roles_priviledges RP
          ON
            UR.roles_id = RP.roles_id
          WHERE
            UR.users_id = '${context.state.user.id}'
        )
      `
    )

    if (result[0].hasPriviledge > 0) {
      return next()
    } else {
      throw new Error(`Unauthorized!`)
    }
  }
}

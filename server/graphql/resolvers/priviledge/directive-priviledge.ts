import { EntityManager, getRepository } from 'typeorm'
import { User } from '../../../entities'

export const directivePriviledge = {
  async priviledge(next, root, args, context, info) {
    if (context && context.domain && context.domain.systemFlag) {
      return next()
    }

    const priviledges = await getRepository(User).query(
      `
        SELECT 
          name,
          category
        FROM
          priviledges
        WHERE
          id
        IN (
          SELECT
            DISTINCT RP.priviledges_id
          FROM
            users_roles UR
          INNER JOIN
            roles_priviledges RP
          ON
            UR.roles_id = RP.roles_id
          WHERE
            UR.users_id = $1
        )
      `,
      [context.state.user.id]
    )

    const assignPriviledge = priviledges.map(priviledge => {
      return `${priviledge.category}-${priviledge.name}`
    })
    if (assignPriviledge.includes(`${args.category}-${args.priviledge}`)) {
      return next()
    } else {
      throw new Error(`Unauthorized!`)
    }
  }
}

import { EntityManager, getRepository } from 'typeorm'
import { User } from '../../../entities'

export const directivePriviledge = {
  async priviledge(next, root, args, context, info) {
    if (context.domain.systemFlag) {
      return next()
    }

    const connection = getRepository(User).metadata.connection
    const em = new EntityManager(connection)
    const priviledges = await em.query(
      `
        SELECT 
          name
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
            UR.users_id = :id
        )
      `,
      [context.state.user.id]
    )

    const priviledgeNames = priviledges.map(priviledge => priviledge.name)
    if (priviledgeNames.includes(args.priviledge)) {
      return next()
    } else {
      throw new Error(`Unauthorized!`)
    }
  }
}

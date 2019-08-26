import { EntityManager, getRepository } from 'typeorm'
import { User } from '../../../entities'

export const directivePriviledge = {
  async priviledge(next, root, args, context, info) {
    console.log('priviledge ============================================')
    console.log('required priviledge', context.state.user, args)

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
      [
        {
          id: context.state.user.id
        }
      ]
    )

    if (priviledges.includes(args.priviledge)) {
      next()
    } else {
      throw new Error(`Unauthorized!`)
    }

    //create logic to compare with priviledge

    console.log('priviledge ============================================')

    // if (context.currentUser.role !== role) {
    // throw new Error(`Unauthorized!`)
    // }

    return next()
  }
}

import { EntityManager, getRepository } from 'typeorm'
import { User } from '../../../entities'

export const directivePriviledge = {
  async priviledge(next, root, args, context, info) {
    console.log('priviledge ============================================')
    console.log('required priviledge', context.state.user, args)

    const connection = getRepository(User).metadata.connection
    const em = new EntityManager(connection)
    const priviledges = await em.query(
      'SELECT DISTINCT rp.PRIVILEDGES_ID FROM USERS_ROLES ur INNER JOIN ROLES_PRIVILEDGES rp on ur.roles_id = rp.roles_id WHERE ur.users_id = :id',
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

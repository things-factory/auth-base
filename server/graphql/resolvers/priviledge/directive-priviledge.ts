import { getRepository } from 'typeorm'
import { Priviledge } from '../../../entities'

export const directivePriviledge = {
  async priviledge(next, root, args, context, info) {
    console.log('priviledge ============================================')
    console.log('required priviledge', context.state.user, args)
    console.log('priviledge ============================================')

    // if (context.currentUser.role !== role) {
    // throw new Error(`Unauthorized!`)
    // }

    return next()
  }
}

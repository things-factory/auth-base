import { getRepository } from 'typeorm'
import { Priviledge } from '../../../entities'

export const directivePriviledge = {
  async priviledge(next, root, args, context, info) {
    console.log('priviledge ============================================')
    console.log('required priviledge', args)
    console.log('priviledge ============================================')

    // if (context.currentUser.role !== role) {
    //   throw new Error(`Unauthorized!`)
    // }

    return next()
  }
}

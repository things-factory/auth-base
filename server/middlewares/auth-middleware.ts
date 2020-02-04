import unless from 'koa-unless'
import { User } from '../entities'
import { getTokens } from '../utils/get-token'
;(authMiddleware as any).unless = unless

export async function authMiddleware(context, next) {
  try {
    const tokens = getTokens(context)
    context.state.token = tokens

    if (!tokens) {
      throw Error('not signed in')
    }

    var decodedToken = await User.checkAndRefresh({
      context,
      tokens
    })
    context.state.user = decodedToken

    return next()
  } catch (e) {
    let status = 401
    context.status = status
    context.body = {
      success: false,
      message: e.message
    }
  }
}

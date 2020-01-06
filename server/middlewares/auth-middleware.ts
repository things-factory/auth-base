import { getPathInfo } from '@things-factory/shell'
import unless from 'koa-unless'
import { URL } from 'url'
import { User } from '../entities'
import { getToken } from '../utils/get-token'
;(authMiddleware as any).unless = unless

export async function authMiddleware(context, next) {
  try {
    const { request } = context
    const { originalUrl, header } = request
    const { referer } = header

    // const ref = referer ? new URL(referer) : originalUrl

    const { contextPath, domain } = getPathInfo(originalUrl)
    const token = getToken(context)
    context.state.token = token

    if (!token) {
      throw Error('not signed in')
    }

    var decodedToken = await User.check(token)
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

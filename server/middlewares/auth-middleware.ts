import { getPathInfo } from '@things-factory/shell'
import unless from 'koa-unless'
import { URL } from 'url'
import { User } from '../entities'
;(authMiddleware as any).unless = unless

function getToken(context) {
  const req = context.request

  var token =
    context.cookies.get('access_token') ||
    req.headers['x-access-token'] ||
    req.headers['authorization'] ||
    req.query.token ||
    null

  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    return token.slice(7, token.length)
  }

  context.state.token = token

  return token
}

export async function authMiddleware(context, next) {
  try {
    var { request } = context
    var { header } = request
    var { referer } = header
    var { pathname, protocol } = new URL(referer)
    var { contextPath, domain } = getPathInfo(pathname)
    var token = getToken(context)

    if (!token) {
      throw Error('not signed in')
    }

    var decodedToken = await User.check(token)
    context.state.user = await User.checkAuth(decodedToken)

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

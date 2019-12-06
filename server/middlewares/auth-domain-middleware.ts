import { getPathInfo } from '@things-factory/shell'
import unless from 'koa-unless'
import { URL } from 'url'
import { DomainError } from '../errors/user-domain-not-match-error'
;(authDomainMiddleware as any).unless = unless

export async function authDomainMiddleware(context, next) {
  var { request } = context
  var { header } = request
  var { referer } = header
  var { pathname } = new URL(referer)
  var { domain, path } = getPathInfo(pathname)
  const user = context.state.user
  try {
    var { token: domainToken, domains } = await user.checkDomain(domain)

    return next()
  } catch (e) {
    let redirectTo
    if (e.errorCode == DomainError.ERROR_CODES.REDIRECT_TO_DEFAULT_DOMAIN) {
      redirectTo = `/domain/${user.domain.subdomain}`
    }

    context.status = 406
    context.body = {
      success: false,
      message: e.message,
      redirectTo
    }
  }
}

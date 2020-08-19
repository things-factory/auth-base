import { User } from '../entities'
import { getToken } from '../utils/get-token'
import { AuthError } from '../errors/auth-error'

const debug = require('debug')('things-factory:auth-base:subdomain-middleware')

export async function subdomainMiddleware(context: any, next: any) {
  try {
    const { domain } = context.state
    debug('context.domain', domain)

    if (!domain) {
      context.redirect(`/signin?redirect_to=${context.originalUrl}`)
      return
    }

    const token = getToken(context)
    if (!token)
      throw new AuthError({
        errorCode: AuthError.ERROR_CODES.TOKEN_INVALID
      })
    const decoded = User.check(token)

    debug('decoded token', domain)
    if (!decoded)
      throw new AuthError({
        errorCode: AuthError.ERROR_CODES.USER_NOT_FOUND
      })

    const { domain: tokenDomain } = decoded as any
    if (tokenDomain.subdomain != domain.subdomain) {
      debug('subdomain mismatch', tokenDomain.subdomain, domain.subdomain)

      context.redirect(`/signin?redirect_to=${context.originalUrl}`)
      return
    }

    await next()
  } catch (e) {
    context.redirect(`/signin?redirect_to=${context.originalUrl}`)
    return
  }
}

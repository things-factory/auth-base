import Router from 'koa-router'
import { User } from '../entities'
import { AuthError } from '../errors/auth-error'
import { getToken } from '../utils/get-token'
import { jwtAuthenticateMiddleware } from '../middlewares'

const debug = require('debug')('things-factory:auth-base:subdomain-router')

export const subdomainRouter = new Router()

async function domainCheck(context, next) {
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
      context.redirect(`/signin?redirect_to=${context.originalUrl}`)
      return
    }

    await next()
  } catch (e) {
    context.redirect(`/signin?redirect_to=${context.originalUrl}`)
    return
  }
}

subdomainRouter.get('/(.*)', jwtAuthenticateMiddleware, async (context, next) => {
  if (!context.state.user) return context.redirect('/signin')
  return await domainCheck(context, next)
})

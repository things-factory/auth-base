import Router from 'koa-router'
import { MAX_AGE } from '../constants/max-age'
import { signinMiddleware } from '../middlewares'
import { getDefaultDomain } from '../utils/default-domain'
import { domainMiddleware } from '@things-factory/shell'
import { config } from '@things-factory/env'

const useSubdomain = config.get('subdomainOffset', 1000) != 1000
const debug = require('debug')('things-factory:auth-base:signin-router')

export const signinRouter = new Router()
signinRouter.use(domainMiddleware)
signinRouter.use(signinMiddleware)

const bodyParserOption = {
  formLimit: '10mb',
  jsonLimit: '10mb',
  textLimit: '10mb'
}
// for authentication
signinRouter.post('/signin', async (context, next) => {
  const { secure, request } = context
  const { token, user, error, domain } = context.state
  const { body: reqBody, header } = request

  debug('/signin:post', token, user, domain)

  if (!user) {
    context.status = 401
    context.body = {
      message: error.message
    }
    return await context.render('auth-page', {
      pageElement: 'auth-signin',
      elementScript: '/signin.js',
      data: {
        message: error.message,
        detail: error.detail
      }
    })
  }

  if (domain) {
    const domains = await user.domains
    if (!domains.find(d => d.subdomain == domain.subdomain)) {
      context.status = 401
      context.body = {
        message: 'not allowed domain'
      }
      return await context.render('auth-page', {
        pageElement: 'auth-signin',
        elementScript: '/signin.js',
        data: {
          message: 'not allowed domain',
          detail: 'not allowed domain'
        }
      })
    }
  }

  if ('x-only-token' in header) {
    context.body = token
  } else {
    const redirectTo = reqBody.redirect_to || (useSubdomain ? '/' : await getDefaultDomain(user))
    context.cookies.set('access_token', token, {
      secure,
      httpOnly: true,
      maxAge: MAX_AGE
    })

    context.redirect(redirectTo)
  }
})

import Router from 'koa-router'
import { MAX_AGE } from '../constants/max-age'
import { signinMiddleware } from '../middlewares'
import { getDefaultDomain } from '../utils/default-domain'

const debug = require('debug')('things-factory:auth-base:auth-signin-passport-router')

export const authSigninPassportRouter = new Router()

authSigninPassportRouter.use(signinMiddleware)

// for authentication
authSigninPassportRouter.post('/signin', async (context, next) => {
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

  if ('x-only-token' in header) {
    context.body = token
    return
  }

  var redirectTo

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

    redirectTo = reqBody.redirect_to || '/'
  } else {
    redirectTo = await getDefaultDomain(user)
  }

  context.cookies.set('access_token', token, {
    secure,
    httpOnly: true,
    maxAge: MAX_AGE
  })

  debug('/signin:post', redirectTo)
  context.redirect(redirectTo)
})

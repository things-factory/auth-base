import { config } from '@things-factory/env'
import koaBodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { getRepository } from 'typeorm'

import { MAX_AGE } from './constants/max-age'
import { resetPassword, sendPasswordResetEmail } from './controllers/reset-password'
import { signup } from './controllers/signup'
import { unlockAccount } from './controllers/unlock-account'
import { resendVerificationEmail, verify } from './controllers/verification'
import { User } from './entities'
import { AuthError } from './errors/auth-error'
import { secureRouter, signinRouter } from './router'
import { getToken } from './utils/get-token'

const SECRET = config.get('SECRET', '0xD58F835B69D207A76CC5F84a70a1D0d4C79dAC95')

async function domainCheck(context, next) {
  try {
    const token = getToken(context)
    if (!token)
      throw new AuthError({
        errorCode: AuthError.ERROR_CODES.TOKEN_INVALID
      })
    const decodedToken = await User.check(token)
    const { params } = context
    const { domainName } = params

    const user = await getRepository(User).findOne({
      where: {
        id: decodedToken.id
      },
      relations: ['domain', 'domains']
    })

    if (!user)
      throw new AuthError({
        errorCode: AuthError.ERROR_CODES.USER_NOT_FOUND
      })

    const userDomain = await user?.domain
    if (userDomain?.subdomain != domainName) return context.redirect(`/checkin/${domainName}`)

    return next()
  } catch (e) {
    const { originalUrl } = context
    return context.redirect(`/signin?redirect_to=${originalUrl}`)
  }
}

process.on('bootstrap-module-history-fallback' as any, (app, fallbackOption) => {
  var paths = [
    // static pages
    'signin',
    'signup',
    'signout',
    'default-domain',
    'domain-select',
    'forgot-password',
    'reset-password',
    'unlock-account',
    'activate',
    'result',
    // apis
    'checkin',
    'profile',
    'verify',
    'update-profile',
    'delete-account'
    // 'domain'
  ]
  fallbackOption.whiteList.push(`^\/(${paths.join('|')})($|[/?#])`)

  const domainRouter = new Router()

  domainRouter.get('*', async (context, next) => {
    getToken(context)
    return next()
  })

  domainRouter.get('/', async (context, next) => {
    const token = getToken(context)
    if (!token) return context.redirect('/signin')
    const decodedToken = await User.check(token)
    if (!decodedToken) return context.redirect('/signin')
    return context.redirect('/default-domain')
  })
  domainRouter.get('/domain/:domainName', async (context, next) => {
    return await domainCheck(context, next)
  })
  domainRouter.get('/domain/:domainName/*', async (context, next) => {
    return await domainCheck(context, next)
  })

  app.use(domainRouter.routes())
})

process.on('bootstrap-module-route' as any, (app, routes) => {
  const bodyParserOption = {
    formLimit: '10mb',
    jsonLimit: '10mb',
    textLimit: '10mb'
  }

  app.use(secureRouter.routes())
  app.use(signinRouter.routes())

  // static pages
  routes.get('/signup', async (context, next) => {
    await context.render('auth-page', {
      pageElement: 'auth-signup',
      elementScript: '/signup.js',
      data: {}
    })
  })

  routes.get('/signout', async (context, next) => {
    context.body = {
      message: 'signout successfully'
    }

    context.cookies.set('access_token', '', {
      httpOnly: true
    })

    context.redirect('/')
  })

  routes.get('/forgot-password', async (context, next) => {
    await context.render('auth-page', {
      pageElement: 'forgot-password',
      elementScript: '/forgot-password.js',
      data: {}
    })
  })

  routes.get('/reset-password', async (context, next) => {
    const { token } = context.request.query
    await context.render('auth-page', {
      pageElement: 'reset-password',
      elementScript: '/reset-password.js',
      data: {
        token
      }
    })
  })

  routes.get('/unlock-account', async (context, next) => {
    const { token } = context.request.query
    await context.render('auth-page', {
      pageElement: 'unlock-account',
      elementScript: '/unlock-account.js',
      data: {
        token
      }
    })
  })

  routes.get('/activate/:email', async (context, next) => {
    const { email } = context.params
    await context.render('auth-page', {
      pageElement: 'auth-activate',
      elementScript: '/activate.js',
      data: {
        email
      }
    })
  })

  routes.get('/result', async (context, next) => {
    await context.render('auth-page', {
      pageElement: 'auth-result',
      elementScript: '/result.js',
      data: {
        message: 'result'
      }
    })
  })

  // for authentication
  routes.post('/signup', koaBodyParser(bodyParserOption), async (context, next) => {
    try {
      let user = context.request.body
      let { token } = await signup(
        {
          ...user,
          context
        },
        true
      )

      context.body = {
        message: 'registered successfully',
        token
      }

      context.cookies.set('access_token', token, {
        httpOnly: true,
        maxAge: MAX_AGE
      })

      context.redirect(`/activate/${user.email}`)
    } catch (e) {
      context.status = 401
      context.body = {
        message: e.message
      }

      await context.render('auth-page', {
        pageElement: 'auth-signup',
        elementScript: '/signup.js',
        data: {
          message: e.message
        }
      })
    }
  })

  routes.post('/signout', koaBodyParser(bodyParserOption), async (context, next) => {
    try {
      context.body = {
        message: 'signout successfully'
      }

      context.cookies.set('access_token', '', {
        httpOnly: true
      })
    } catch (e) {
      context.status = 401
      context.body = {
        message: e.message
      }
    }
  })

  routes.get('/verify/:token', async (context, next) => {
    try {
      var token = context.params.token
      var isVerified = await verify(token)

      if (isVerified) {
        context.redirect(`/result`)
      } else {
        context.status = 404
        context.body = 'User or verification token not found'
        context.redirect('/signin')
      }
    } catch (e) {
      throw new Error(e)
    }
  })

  routes.post('/resend-verification-email', koaBodyParser(bodyParserOption), async (context, next) => {
    const { email } = context.request.body
    try {
      var succeed = await resendVerificationEmail(email, context)
      var message = 'verification email sent'

      if (succeed) {
        context.status = 200
        context.body = message
      }
    } catch (e) {
      throw new Error(e)
    }
  })

  routes.post('/forgot-password', koaBodyParser(bodyParserOption), async (context, next) => {
    try {
      var { email } = context.request.body
      if (!email) return next()

      const userRepo = getRepository(User)
      const user = await userRepo.findOne({
        where: {
          email
        }
      })

      var succeed = await sendPasswordResetEmail({
        user,
        context
      })

      if (succeed) {
        context.status = 200
        context.body = 'password reset email sent'
      }
    } catch (e) {
      throw new Error(e)
    }
  })

  routes.post('/reset-password', koaBodyParser(bodyParserOption), async (context, next) => {
    try {
      const { password, token } = context.request.body
      if (!(token && password)) {
        context.status = 404
        let message = 'token or password is invalid'
        context.body = {
          message
        }
        await context.render('auth-page', {
          pageElement: 'reset-password',
          elementScript: '/reset-password.js',
          data: {
            token,
            message
          }
        })
        return
      }

      var succeed = await resetPassword(token, password)

      if (succeed) {
        var message = 'password reset succeed'
        context.body = {
          message
        }

        context.cookies.set('access_token', '', {
          httpOnly: true
        })

        await context.render('auth-page', {
          pageElement: 'auth-result',
          elementScript: '/result.js',
          data: {
            message: 'password change succeed'
          }
        })
      } else {
        context.status = 404
        let message = 'token is invalid'
        context.body = {
          message
        }
        await context.render('auth-page', {
          pageElement: 'auth-result',
          elementScript: '/result.js',
          data: {
            message
          }
        })
      }
    } catch (e) {
      throw new Error(e)
    }
  })

  routes.post('/unlock-account', koaBodyParser(bodyParserOption), async (context, next) => {
    try {
      var { password, token } = context.request.body

      if (!(token || password)) {
        context.status = 404
        context.body = {
          message: 'token or password is invalid'
        }
        return
      }

      var succeed = await unlockAccount(token, password)

      if (succeed) {
        var message = 'password reset succeed'
        context.body = {
          message
        }

        context.cookies.set('access_token', '', {
          httpOnly: true
        })

        await context.render('auth-page', {
          pageElement: 'auth-result',
          elementScript: '/result.js',
          data: {
            message: 'Your account is reactivated'
          }
        })
      }
    } catch (e) {
      throw new Error(e)
    }
  })
})

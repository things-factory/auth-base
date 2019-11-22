import { getPathInfo } from '@things-factory/shell'
import koaBodyParser from 'koa-bodyparser'
import { URL } from 'url'
import { authcheck } from './controllers/authcheck'
import { changePwd } from './controllers/change-pwd'
import { updateProfile } from './controllers/profile'
import { signin } from './controllers/signin'
import { signup } from './controllers/signup'
import { resendVerificationEmail, verify } from './controllers/verification'
import { User } from './entities'
import { UserDomainNotMatchError } from './errors/user-domain-not-match-error'

const MAX_AGE = 7 * 24 * 3600 * 1000

process.on('bootstrap-module-history-fallback' as any, (app, fallbackOption) => {
  var paths = ['authcheck', 'verify', 'resend-verification-email', 'update-profile']

  fallbackOption.whiteList.push(`^\/(${paths.join('|')})($|[/?#])`)
})

process.on('bootstrap-module-route' as any, (app, routes) => {
  const bodyParserOption = {
    formLimit: '10mb',
    jsonLimit: '10mb',
    textLimit: '10mb'
  }

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
    } catch (e) {
      context.status = 401
      context.body = {
        message: e.message
      }
    }
  })

  routes.post('/signin', koaBodyParser(bodyParserOption), async (context, next) => {
    try {
      let user = context.request.body
      let { token, domains } = await signin(user)

      context.body = {
        message: 'signin successfully',
        token,
        domains
      }

      context.cookies.set('access_token', token, {
        httpOnly: true,
        maxAge: MAX_AGE
      })
    } catch (e) {
      context.status = 401
      context.body = {
        message: e.message
      }
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

  routes.get('/authcheck', async (context, next) => {
    try {
      var { request } = context
      var { header } = request
      var { referer } = header
      var { pathname } = new URL(referer)
      var { domain } = getPathInfo(pathname)

      // 새로운 토큰 발급
      var { token, domains } = await authcheck({
        id: context.state.user.id,
        domain
      })

      context.cookies.set('access_token', token, {
        httpOnly: true,
        maxAge: MAX_AGE
      })

      context.state.user = await User.check(token)

      context.body = {
        message: 'token checked successfully',
        token,
        domains,
        user: context.state.user // jwt-koa or authMiddleware will set context.state.token, user
      }
    } catch (e) {
      var status = 401
      var body = {}
      if (e.errorCode) {
        body['errorCode'] = e.errorCode
        if (e instanceof UserDomainNotMatchError) {
          status = 406
          body = {
            ...body,
            domains: e.domains,
            user: context.state.user
          }
        }
      } else {
        status = 500
      }

      context.status = status
      context.body = {
        message: e.message,
        domains: domains || [],
        ...body
      }
    }
  })

  routes.post('/update-profile', koaBodyParser(bodyParserOption), async (context, next) => {
    try {
      let newProfiles = context.request.body
      await updateProfile(context.state.user, newProfiles)

      context.body = {
        message: 'Success'
      }
    } catch (e) {
      throw new Error(e)
    }
  })

  routes.post('/change_pass', koaBodyParser(bodyParserOption), async (context, next) => {
    try {
      let newPassword = context.request.body.new_pass
      const token = await changePwd(context.state.user, newPassword)

      context.body = {
        message: 'Password Changed Successfully',
        token
      }

      context.cookies.set('access_token', token, {
        httpOnly: true,
        maxAge: MAX_AGE
      })
    } catch (e) {
      throw new Error(e)
    }
  })

  routes.get('/verify/:token', async (context, next) => {
    try {
      var token = context.params.token
      var isVerified = await verify(token)

      if (isVerified) context.redirect('/')
      else {
        context.status = 404
        context.body = 'User or verification token not found'
      }
    } catch (e) {
      throw new Error(e)
    }
  })

  routes.get('/resend-verification-email', async (context, next) => {
    try {
      var { user } = context.state

      if (!user) return next()

      var { email } = user
      var succeed = await resendVerificationEmail(email, context)

      if (succeed) {
        context.status = 200
        context.body = 'verification email sent'
      }
    } catch (e) {
      throw new Error(e)
    }
  })
})

import { getPathInfo } from '@things-factory/shell'
import koaBodyParser from 'koa-bodyparser'
import { getRepository } from 'typeorm'
import { URL } from 'url'
import { USER_NOT_ACTIVATED } from './constants/error-code'
import { authcheck } from './controllers/authcheck'
import { changePwd } from './controllers/change-pwd'
import { deleteAccount } from './controllers/delete-account'
import { updateProfile } from './controllers/profile'
import { resetPassword, sendPasswordResetEmail } from './controllers/reset-password'
import { signin } from './controllers/signin'
import { signup } from './controllers/signup'
import { resendVerificationEmail, verify } from './controllers/verification'
import { User } from './entities'
import { DomainError } from './errors/user-domain-not-match-error'

const MAX_AGE = 7 * 24 * 3600 * 1000

process.on('bootstrap-module-history-fallback' as any, (app, fallbackOption) => {
  var paths = ['authcheck', 'verify', 'update-profile', 'delete-account', '/']

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
    let user = context.request.body
    try {
      let { request } = context
      let { header } = request
      let { referer } = header
      let { protocol } = new URL(referer)
      let { user: userInfo, token, domains } = await signin(user)
      let redirectTo = 'domain-select'

      if (userInfo.domain) redirectTo = `/domain/${userInfo.domain.subdomain}`

      context.body = {
        message: 'signin successfully',
        token,
        domains,
        redirectTo
      }

      context.cookies.set('access_token', token, {
        secure: protocol == 'https' ? true : false,
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
      var { protocol, pathname } = new URL(referer)
      var { contextPath, domain, path } = getPathInfo(pathname)

      const user = context.state.user

      var { domains } = await User.checkAuth(user)

      context.body = {
        message: 'token checked successfully',
        domains,
        user, // jwt-koa or authMiddleware will set context.state.token, user
        redirectTo: user.domain ? `/domain/${user.domain}` : null
      }
    } catch (e) {
      var status = 401
      var body = {}
      if (e.errorCode) {
        body['errorCode'] = e.errorCode
        if (e instanceof DomainError) {
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

      if (isVerified) {
        context.redirect(`/congratulations`)
      } else {
        context.status = 404
        context.body = 'User or verification token not found'
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

  routes.post('/delete-account', koaBodyParser(bodyParserOption), async (context, next) => {
    try {
      var { user } = context.state
      var { email: userEmail } = user

      var { password, email } = context.request.body

      const userRepo = getRepository(User)
      const userInfo = await userRepo.findOne({
        where: {
          email: userEmail
        }
      })

      if (email != userEmail || !userInfo.verify(password)) {
        context.status = 404
        context.body = {
          message: 'id and password not matched'
        }
        return
      }

      var succeed = await deleteAccount(user)

      if (succeed) {
        context.body = {
          message: 'delete account succeed'
        }

        context.cookies.set('access_token', '', {
          httpOnly: true
        })
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
      var { password, token } = context.request.body

      if (!(token || password)) {
        context.status = 404
        context.body = {
          message: 'token or password is invalid'
        }
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
      }
    } catch (e) {
      throw new Error(e)
    }
  })
})

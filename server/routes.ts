import { getPathInfo } from '@things-factory/shell'
import koaBodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { getRepository } from 'typeorm'
import { URL } from 'url'
import { changePwd } from './controllers/change-pwd'
import { checkin } from './controllers/checkin'
import { deleteAccount } from './controllers/delete-account'
import { updateProfile } from './controllers/profile'
import { resetPassword, sendPasswordResetEmail } from './controllers/reset-password'
import { signin } from './controllers/signin'
import { signup } from './controllers/signup'
import { unlockAccount } from './controllers/unlock-account'
import { resendVerificationEmail, verify } from './controllers/verification'
import { User } from './entities'
import { AuthError } from './errors/auth-error'
import { getToken } from './utils/get-token'

const MAX_AGE = 7 * 24 * 3600 * 1000

function getDefaultDomain(userInfo, fallbackUrl = '/domain-select') {
  let redirectTo = fallbackUrl
  if (userInfo.domain) redirectTo = `/checkin/${userInfo.domain.subdomain}`

  return redirectTo
}

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
    if (user?.domain?.subdomain != domainName) return context.redirect(`/checkin/${domainName}`)

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

  // static pages
  routes.get('/signin', async (context, next) => {
    try {
      const { query } = context
      const { redirect_to } = query
      // check signed in
      const token = getToken(context)
      if (!token)
        return await context.render('auth-page', {
          pageElement: 'auth-signin',
          elementScript: '/signin.js',
          data: {
            redirectTo: redirect_to
          }
        })

      const user = await User.check(token)
      const redirectTo = getDefaultDomain(user)

      context.redirect(redirectTo)
    } catch (e) {
      await context.render('auth-page', {
        pageElement: 'auth-signin',
        elementScript: '/signin.js',
        data: {}
      })
    }
  })

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

  routes.get('/default-domain', async (context, next) => {
    const token = getToken(context)
    if (!token) return context.redirect('/signin')
    const user = await User.check(token)
    if (!user) return context.redirect('/signin')

    if (!user.domain) return context.redirect('/domain-select')
    return context.redirect(`/domain/${user.domain.subdomain}`)
  })

  routes.get('/domain-select', async (context, next) => {
    const { secure } = context
    try {
      const token = getToken(context)
      if (!token) return context.redirect('/signin')
      const user = await User.check(token)
      if (!user) return context.redirect('/signin')
      const { domains } = await User.checkAuth(user)

      await context.render('auth-page', {
        pageElement: 'auth-domain-select',
        elementScript: '/domain-select.js',
        data: {
          domains
        }
      })
    } catch (e) {
      context.cookies.set('access_token', '', {
        secure,
        httpOnly: true
      })
      context.redirect('/signin')
    }
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

  routes.get('/checkin/:domainName', async (context, next) => {
    try {
      const { params, secure } = context
      const { domainName } = params
      const { user } = context.state

      const newToken = await checkin({
        userId: user.id,
        domainName
      })

      if (newToken) {
        context.cookies.set('access_token', newToken, {
          secure,
          httpOnly: true,
          maxAge: MAX_AGE
        })
        context.redirect(`/domain/${domainName}`)
      } else {
        context.redirect('/domain-select')
      }
    } catch (e) {
      context.redirect('/domain-select')
    }
  })

  // for authentication
  routes.post('/signin', koaBodyParser(bodyParserOption), async (context, next) => {
    let user = context.request.body
    try {
      const { secure } = context
      const { user: userInfo, token, domains } = await signin(user, context)

      const redirectTo = user.redirect_to || getDefaultDomain(userInfo)

      let responseObj = {
        message: 'signin successfully',
        token,
        domains
      }

      context.cookies.set('access_token', token, {
        secure,
        httpOnly: true,
        maxAge: MAX_AGE
      })

      context.redirect(redirectTo)
    } catch (e) {
      let message
      let detail

      switch (e.errorCode) {
        case AuthError.ERROR_CODES.USER_NOT_ACTIVATED:
          return context.redirect(`/activate/${user.email}`)
        // case AuthError.ERROR_CODES.USER_NOT_FOUND:
        // case AuthError.ERROR_CODES.PASSWORD_NOT_MATCHED:
        //   message = `${AuthError.ERROR_CODES.PASSWORD_NOT_MATCHED}`
        //   detail = e.detail
        //   break
        default:
          message = e.errorCode
          detail = e.detail
          break
      }

      context.status = 401
      context.body = {
        message
      }

      await context.render('auth-page', {
        pageElement: 'auth-signin',
        elementScript: '/signin.js',
        data: {
          message,
          detail
        }
      })
    }
  })

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

  routes.get('/profile', async (context, next) => {
    try {
      const { request } = context
      const { header } = request
      const { referer } = header
      const { pathname } = new URL(referer)
      const { domain, path, contextPath } = getPathInfo(pathname)
      const userRepo = getRepository(User)
      const user = await userRepo.findOne({
        where: {
          id: context.state.user.id
        },
        relations: ['domain', 'domains']
      })

      context.body = {
        user,
        domains: user.domains // jwt-koa or authMiddleware will set context.state.token, user
      }
    } catch (e) {
      context.body = {
        message: e.message,
        domains: []
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

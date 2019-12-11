import { getPathInfo } from '@things-factory/shell'
import koaBodyParser from 'koa-bodyparser'
import { getRepository } from 'typeorm'
import { URL } from 'url'
import { authcheck } from './controllers/authcheck'
import { changePwd } from './controllers/change-pwd'
import { checkin } from './controllers/checkin'
import { deleteAccount } from './controllers/delete-account'
import { updateProfile } from './controllers/profile'
import { resetPassword, sendPasswordResetEmail } from './controllers/reset-password'
import { signin } from './controllers/signin'
import { signup } from './controllers/signup'
import { resendVerificationEmail, verify } from './controllers/verification'
import { User } from './entities'
import { DomainError } from './errors/user-domain-not-match-error'
import { getToken } from './utils/get-token'
import { AuthError } from './errors/auth-error'
import Router from 'koa-router'

const MAX_AGE = 7 * 24 * 3600 * 1000

function getDefaultDomain(userInfo, fallbackUrl = '/domain-select') {
  let redirectTo = fallbackUrl
  // if (userInfo.domain) redirectTo = `/domain/${userInfo.domain.subdomain}`
  if (userInfo.domain) redirectTo = `/checkin/${userInfo.domain.subdomain}`

  return redirectTo
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
    'activate',
    'congratulations',
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

  domainRouter.get('/', async (context, next) => {
    const token = getToken(context)
    if (!token) return context.redirect('/signin')
    const decodedToken = await User.check(token)
    if (!decodedToken) return context.redirect('/signin')
    return context.redirect('/default-domain')
  })
  domainRouter.get('/domain/:domainName', async (context, next) => {
    const token = getToken(context)
    const decodedToken = await User.check(token)
    const { params } = context
    const { domainName } = params

    const user = await getRepository(User).findOne({
      where: {
        id: decodedToken.id
      },
      relations: ['domain', 'domains']
    })

    if (!user) return context.redirect('/signin')
    if (!user.domain || user.domain.subdomain != domainName) return context.redirect(`/checkin/${domainName}`)

    return next()
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
      const { request } = context
      const { header } = request
      const { referer } = header
      // check signed in
      const token = getToken(context)
      if (!token)
        return await context.render('auth-page', {
          pageElement: 'auth-signin',
          elementScript: '/signin.js',
          data: {
            redirectTo: referer
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
    var { request } = context
    var { originalUrl } = request

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

  routes.get('/congratulations', async (context, next) => {
    await context.render('auth-page', {
      pageElement: 'auth-congratulations',
      elementScript: '/congratulations.js',
      data: {
        message: 'congratulations'
      }
    })
  })

  routes.get('/checkin/:domainName', async (context, next) => {
    try {
      const { params, protocol } = context
      const { domainName } = params
      const { user } = context.state

      const newToken = await checkin({
        userId: user.id,
        domainName
      })

      if (newToken) {
        context.cookies.set('access_token', newToken, {
          secure: protocol == 'https' ? true : false,
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
      let { request } = context
      let { header } = request
      let { referer } = header
      let { protocol } = new URL(referer)
      let { user: userInfo, token, domains } = await signin(user)

      let redirectTo = user.redirect_to || getDefaultDomain(userInfo)

      let responseObj = {
        message: 'signin successfully',
        token,
        domains
      }

      context.cookies.set('access_token', token, {
        secure: protocol == 'https' ? true : false,
        httpOnly: true,
        maxAge: MAX_AGE
      })

      context.redirect(redirectTo)
    } catch (e) {
      context.status = 401
      context.body = {
        message: e.message
      }

      if (e.errorCode == AuthError.ERROR_CODES.USER_NOT_ACTIVATED) {
        context.redirect(`/activate/${user.email}`)
      } else {
        await context.render('auth-page', {
          pageElement: 'auth-signin',
          elementScript: '/signin.js',
          data: {
            message: e.message
          }
        })
      }
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
        context.redirect(`/congratulations`)
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

        await context.render('auth-page', {
          pageElement: 'auth-congratulations',
          elementScript: '/congratulations.js',
          data: {
            message: 'password change succeed'
          }
        })
      }
    } catch (e) {
      throw new Error(e)
    }
  })
})

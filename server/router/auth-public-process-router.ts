import Router from 'koa-router'
import { getRepository } from 'typeorm'
import { MAX_AGE } from '../constants/max-age'
import { resetPassword, sendPasswordResetEmail } from '../controllers/reset-password'
import { signup } from '../controllers/signup'
import { unlockAccount } from '../controllers/unlock-account'
import { resendVerificationEmail, verify } from '../controllers/verification'
import { User } from '../entities'

const debug = require('debug')('things-factory:auth-base:auth-public-process-router')

export const authPublicProcessRouter = new Router()

// static pages
authPublicProcessRouter.get('/signup', async (context, next) => {
  await context.render('auth-page', {
    pageElement: 'auth-signup',
    elementScript: '/signup.js',
    data: {}
  })
})

authPublicProcessRouter.get('/signout', async (context, next) => {
  context.body = {
    message: 'signout successfully'
  }

  context.cookies.set('access_token', '', {
    httpOnly: true
  })
  debug('/signout:get')

  context.redirect('/')
})

authPublicProcessRouter.get('/forgot-password', async (context, next) => {
  await context.render('auth-page', {
    pageElement: 'forgot-password',
    elementScript: '/forgot-password.js',
    data: {}
  })
})

authPublicProcessRouter.get('/reset-password', async (context, next) => {
  const { token } = context.request.query
  await context.render('auth-page', {
    pageElement: 'reset-password',
    elementScript: '/reset-password.js',
    data: {
      token
    }
  })
})

authPublicProcessRouter.get('/unlock-account', async (context, next) => {
  const { token } = context.request.query
  await context.render('auth-page', {
    pageElement: 'unlock-account',
    elementScript: '/unlock-account.js',
    data: {
      token
    }
  })
})

authPublicProcessRouter.get('/activate/:email', async (context, next) => {
  const { email } = context.params
  await context.render('auth-page', {
    pageElement: 'auth-activate',
    elementScript: '/activate.js',
    data: {
      email
    }
  })
})

authPublicProcessRouter.get('/result', async (context, next) => {
  await context.render('auth-page', {
    pageElement: 'auth-result',
    elementScript: '/result.js',
    data: {
      message: 'result'
    }
  })
})

// for authentication
authPublicProcessRouter.post('/signup', async (context, next) => {
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

authPublicProcessRouter.post('/signout', async (context, next) => {
  try {
    context.body = {
      message: 'signout successfully'
    }

    debug('/signout:post')

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

authPublicProcessRouter.get('/verify/:token', async (context, next) => {
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

authPublicProcessRouter.post('/resend-verification-email', async (context, next) => {
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

authPublicProcessRouter.post('/forgot-password', async (context, next) => {
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

authPublicProcessRouter.post('/reset-password', async (context, next) => {
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

authPublicProcessRouter.post('/unlock-account', async (context, next) => {
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

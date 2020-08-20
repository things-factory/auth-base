import koaBodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { getRepository } from 'typeorm'
import { MAX_AGE } from '../constants/max-age'
import { changePwd } from '../controllers/change-pwd'
import { deleteAccount } from '../controllers/delete-account'
import { updateProfile } from '../controllers/profile'
import { User } from '../entities'
import { jwtAuthenticateMiddleware } from '../middlewares'
import { checkin } from '../controllers/checkin'

import { config } from '@things-factory/env'
import { domainMiddleware } from '@things-factory/shell'

const useSubdomain = !!config.get('subdomainOffset')
const debug = require('debug')('things-factory:auth-base:auth-private-process-router')

export const authPrivateProcessRouter = new Router()

authPrivateProcessRouter.use(domainMiddleware)
authPrivateProcessRouter.use(jwtAuthenticateMiddleware)

const bodyParserOption = {
  formLimit: '10mb',
  jsonLimit: '10mb',
  textLimit: '10mb'
}

authPrivateProcessRouter
  .get('/signin', async (context, next) => {
    try {
      const { query } = context
      const { user, domain } = context.state
      const { redirect_to } = query

      debug('/signin', user, domain)

      if (!user) {
        await context.render('auth-page', {
          pageElement: 'auth-signin',
          elementScript: '/signin.js',
          data: {
            redirectTo: redirect_to
          }
        })
        return
      }

      if (!domain) {
        debug('/signin redirect to /domain-select')
        context.redirect('/domain-select')
        return
      }

      context.redirect(redirect_to)
    } catch (e) {
      await context.render('auth-page', {
        pageElement: 'auth-signin',
        elementScript: '/signin.js',
        data: {}
      })
    }
  })
  .post('/change_pass', koaBodyParser(bodyParserOption), async (context, next) => {
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
  .post('/update-profile', koaBodyParser(bodyParserOption), async (context, next) => {
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
  .post('/delete-account', koaBodyParser(bodyParserOption), async (context, next) => {
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
  .get('/profile', async (context, next) => {
    try {
      if (context.state.error) throw context.state.error

      const userRepo = getRepository(User)
      const user = await userRepo.findOne({
        where: {
          id: context.state.user.id
        }
      })

      context.body = {
        user,
        domains: await user.domains // jwt-koa or authMiddleware will set context.state.token, user
      }
    } catch (e) {
      context.body = {
        message: e.message,
        domains: []
      }
    }
  })
  .get('/default-domain', async (context, next) => {
    const { user } = context.state

    const domain = await user.domain
    if (!domain) return context.redirect('/domain-select')
    return context.redirect(`/domain/${domain.subdomain}`)
  })
  .get('/domain-select', async (context, next) => {
    const { secure } = context
    const { user } = context.state

    debug('get:/domain-select', secure, user)
    try {
      const domains = await user.domains

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
  .get('/checkin/:domainName', async (context, next) => {
    try {
      const { params, secure } = context
      const { domainName } = params
      const { user } = context.state

      const newToken = await checkin({
        userId: user.id,
        domainName
      })

      debug('get:/checkin/:domainName', useSubdomain, user, newToken)

      if (newToken) {
        context.cookies.set('access_token', newToken, {
          secure,
          httpOnly: true,
          maxAge: MAX_AGE
        })

        if (useSubdomain) {
          const { protocol, host } = context
          const redirectTo = `${protocol}://${domainName}.${host}/`
          debug('get:/checkin/:domainName', protocol, host, redirectTo)
          context.redirect(redirectTo)
        } else {
          context.redirect(`/domain/${domainName}`)
        }
      } else {
        context.redirect('/domain-select')
      }
    } catch (e) {
      context.redirect('/domain-select')
    }
  })

import koaBodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { getRepository } from 'typeorm'
import { MAX_AGE } from '../constants/max-age'
import { changePwd } from '../controllers/change-pwd'
import { deleteAccount } from '../controllers/delete-account'
import { updateProfile } from '../controllers/profile'
import { User } from '../entities'
import { jwtAuthenticateMiddleware } from '../middlewares'
import { getDefaultDomain } from '../utils/default-domain'

import { config } from '@things-factory/env'
import { domainMiddleware } from '@things-factory/shell'

const useSubdomain = config.get('subdomainOffset', 1000) != 1000
const debug = require('debug')('things-factory:auth-base:secure-router')

export const secureRouter = new Router()

secureRouter.use(domainMiddleware)
secureRouter.use(jwtAuthenticateMiddleware)

const bodyParserOption = {
  formLimit: '10mb',
  jsonLimit: '10mb',
  textLimit: '10mb'
}

secureRouter
  .get('/signin', async (context, next) => {
    try {
      const { query } = context
      const { user, domain } = context.state
      const { redirect_to } = query

      debug('/signin', useSubdomain, user, domain)
      // check signed in
      if (!user || (useSubdomain && !domain)) {
        await context.render('auth-page', {
          pageElement: 'auth-signin',
          elementScript: '/signin.js',
          data: {
            redirectTo: redirect_to
          }
        })
        return
      }

      if (useSubdomain && domain) {
        context.redirect(redirect_to)
        return
      }

      const redirectTo = await getDefaultDomain(user)

      context.redirect(redirectTo)
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

import koaBodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { getRepository } from 'typeorm'
import { MAX_AGE } from '../constants/max-age'
import { changePwd } from '../controllers/change-pwd'
import { checkin } from '../controllers/checkin'
import { deleteAccount } from '../controllers/delete-account'
import { updateProfile } from '../controllers/profile'
import { User } from '../entities'
import { jwtAuthenticateMiddleware } from '../middlewares'

export const secureRouter = new Router()
secureRouter.use(jwtAuthenticateMiddleware)

const bodyParserOption = {
  formLimit: '10mb',
  jsonLimit: '10mb',
  textLimit: '10mb'
}

secureRouter
  .get('/default-domain', async (context, next) => {
    const { user } = context.state
    if (!user) return context.redirect('/signin')

    const domain = await user.domain
    if (!domain) return context.redirect('/domain-select')
    return context.redirect(`/domain/${domain.subdomain}`)
  })
  .get('/domain-select', async (context, next) => {
    const { secure } = context
    const { user } = context.state
    try {
      if (!user) return context.redirect('/signin')
      const domains = await user.domains

      context.body = {
        success: true,
        domains
      }
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
        user: {
          ...user,
          domain: await user.domain
        },
        domains: await user.domains // jwt-koa or authMiddleware will set context.state.token, user
      }
    } catch (e) {
      context.status = 401
      context.body = {
        message: e.message,
        domains: []
      }
    }
  })

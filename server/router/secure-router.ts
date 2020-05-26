import koaBodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { getRepository } from 'typeorm'
import { MAX_AGE } from '../constants/max-age'
import { changePwd } from '../controllers/change-pwd'
import { checkin, checkinTo } from '../controllers/checkin'
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
  .get('/checkin/:domainName', async (context, next) => {
    try {
      const { params } = context
      const { domainName } = params
      const { user } = context.state

      const checkedIn = await checkinTo({
        user,
        domainName
      })

      if (checkedIn) {
        context.body = {
          success: true
        }
      } else {
        context.body = {
          success: false
        }
      }
    } catch (e) {
      context.status = 401
      context.body = {
        success: false
      }
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
        ...user,
        domain: await user.domain,
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

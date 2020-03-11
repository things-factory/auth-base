import koaBodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { signinMiddleware } from '../middlewares'

export const signinRouter = new Router()
signinRouter.use(signinMiddleware)

const bodyParserOption = {
  formLimit: '10mb',
  jsonLimit: '10mb',
  textLimit: '10mb'
}
// for authentication
signinRouter.post('/signin', koaBodyParser(bodyParserOption), async (context, next) => {
  // let user = context.request.body
  // try {
  //   const { secure } = context
  //   const { user: userInfo, token, domains } = await signin(user, context)
  //   const redirectTo = user.redirect_to || getDefaultDomain(userInfo)
  //   let responseObj = {
  //     message: 'signin successfully',
  //     token,
  //     domains
  //   }
  //   context.cookies.set('access_token', token, {
  //     secure,
  //     httpOnly: true,
  //     maxAge: MAX_AGE
  //   })
  //   context.redirect(redirectTo)
  // } catch (e) {
  //   let message
  //   let detail
  //   switch (e.errorCode) {
  //     case AuthError.ERROR_CODES.USER_NOT_ACTIVATED:
  //       return context.redirect(`/activate/${user.email}`)
  //     // case AuthError.ERROR_CODES.USER_NOT_FOUND:
  //     // case AuthError.ERROR_CODES.PASSWORD_NOT_MATCHED:
  //     //   message = `${AuthError.ERROR_CODES.PASSWORD_NOT_MATCHED}`
  //     //   detail = e.detail
  //     //   break
  //     default:
  //       message = e.errorCode
  //       detail = e.detail
  //       break
  //   }
  //   context.status = 401
  //   context.body = {
  //     message
  //   }
  //   await context.render('auth-page', {
  //     pageElement: 'auth-signin',
  //     elementScript: '/signin.js',
  //     data: {
  //       message,
  //       detail
  //     }
  //   })
  // }
})

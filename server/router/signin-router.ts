import Router from 'koa-router'
import { MAX_AGE } from '../constants/max-age'
import { signinMiddleware } from '../middlewares'
import { getDefaultDomain } from '../utils/default-domain'

export const signinRouter = new Router()
signinRouter.use(signinMiddleware)

const bodyParserOption = {
  formLimit: '10mb',
  jsonLimit: '10mb',
  textLimit: '10mb'
}
// for authentication
signinRouter.post('/signin', async (context, next) => {
  const { secure, request } = context
  const { token, user, error } = context.state
  const { body: reqBody } = request

  if (!user) {
    context.status = 401
    context.body = {
      message: error.message
    }
    return await context.render('auth-page', {
      pageElement: 'auth-signin',
      elementScript: '/signin.js',
      data: {
        message: error.message,
        detail: error.detail
      }
    })
  }

  const redirectTo = reqBody.redirect_to || (await getDefaultDomain(user))
  context.cookies.set('access_token', token, {
    secure,
    httpOnly: true,
    maxAge: MAX_AGE
  })

  context.redirect(redirectTo)
})

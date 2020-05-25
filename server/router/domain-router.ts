import Router from 'koa-router'
import { User } from '../entities'
import { AuthError } from '../errors/auth-error'
import { jwtAuthenticateMiddleware } from '../middlewares'
import { getToken } from '../utils/get-token'
export const domainRouter = new Router()

const bodyParserOption = {
  formLimit: '10mb',
  jsonLimit: '10mb',
  textLimit: '10mb'
}
// for authentication

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

    const user = { ...decodedToken }

    if (!user)
      throw new AuthError({
        errorCode: AuthError.ERROR_CODES.USER_NOT_FOUND
      })

    const userDomain = await user.domain
    if (userDomain?.subdomain != domainName) return context.redirect(`/checkin/${domainName}`)

    context = {
      success: true,
      token: user
    }
  } catch (e) {
    const { originalUrl } = context
    context.status = 401
    return

    // return context.redirect(`/signin?redirect_to=${originalUrl}`)
  }
}

domainRouter
  .get('*', async (context, next) => {
    return await next()
  })
  .get('/', jwtAuthenticateMiddleware, async (context, next) => {
    if (!context.state.user) {
      context.status = 401
      return
    }
    return context.redirect('/default-domain')
  })
  .get('/domain/:domainName', jwtAuthenticateMiddleware, async (context, next) => {
    if (!context.state.user) {
      context.status = 401
      return
    }
    return await domainCheck(context, next)
  })
  .get('/domain/:domainName/*', jwtAuthenticateMiddleware, async (context, next) => {
    if (!context.state.user) {
      context.status = 401
      return
    }
    return await domainCheck(context, next)
  })

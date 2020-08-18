import Router from 'koa-router'
import { checkin } from '../controllers/checkin'
import { User } from '../entities'
import { AuthError } from '../errors/auth-error'
import { getToken } from '../utils/get-token'
import { jwtAuthenticateMiddleware } from '../middlewares'
import { MAX_AGE } from '../constants/max-age'

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

    return next()
  } catch (e) {
    const { originalUrl } = context
    return context.redirect(`/signin?redirect_to=${originalUrl}`)
  }
}

domainRouter
  .get('(.*)', async (context, next) => {
    return await next()
  })
  .get('/', jwtAuthenticateMiddleware, async (context, next) => {
    if (!context.state.user) return context.redirect('/signin')
    return context.redirect('/default-domain')
  })
  .get('/domain/:domainName', jwtAuthenticateMiddleware, async (context, next) => {
    if (!context.state.user) return context.redirect('/signin')
    return await domainCheck(context, next)
  })
  .get('/domain/:domainName/(.*)', jwtAuthenticateMiddleware, async (context, next) => {
    if (!context.state.user) return context.redirect('/signin')
    return await domainCheck(context, next)
  })
  .get('/default-domain', jwtAuthenticateMiddleware, async (context, next) => {
    const { user } = context.state
    if (!user) return context.redirect('/signin')

    const domain = await user.domain
    if (!domain) return context.redirect('/domain-select')
    return context.redirect(`/domain/${domain.subdomain}`)
  })
  .get('/domain-select', jwtAuthenticateMiddleware, async (context, next) => {
    const { secure } = context
    const { user } = context.state
    try {
      if (!user) return context.redirect('/signin')
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
  .get('/checkin/:domainName', jwtAuthenticateMiddleware, async (context, next) => {
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

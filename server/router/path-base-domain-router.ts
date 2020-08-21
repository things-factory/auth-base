import Router from 'koa-router'
import { User } from '../entities'
import { AuthError } from '../errors/auth-error'
import { getToken } from '../utils/get-token'
import { jwtAuthenticateMiddleware } from '../middlewares'

const debug = require('debug')('things-factory:auth-base:domain-router')

export const pathBaseDomainRouter = new Router()
pathBaseDomainRouter.use(jwtAuthenticateMiddleware)

// async function domainCheck(context, next) {
//   try {
//     const token = getToken(context)
//     if (!token)
//       throw new AuthError({
//         errorCode: AuthError.ERROR_CODES.TOKEN_INVALID
//       })
//     const decodedToken = await User.check(token)
//     const { params } = context
//     const { domainName } = params

//     const user = { ...decodedToken }

//     if (!user)
//       throw new AuthError({
//         errorCode: AuthError.ERROR_CODES.USER_NOT_FOUND
//       })

//     const userDomain = await user.domain
//     if (userDomain?.subdomain != domainName) return context.redirect(`/checkin/${domainName}`)

//     return next()
//   } catch (e) {
//     const { originalUrl } = context
//     return context.redirect(`/signin?redirect_to=${originalUrl}`)
//   }
// }

pathBaseDomainRouter
  // .get('/', async (context, next) => {
  //   // if (!context.state.user) return context.redirect('/signin')
  //   // return context.redirect('/default-domain')
  //   await next()
  // })
  .get('/:domainName', async (context, next) => {
    // if (!context.state.user) return context.redirect('/signin')
    // return await domainCheck(context, next)
    await next()
  })
  .get('/:domainName/(.*)', async (context, next) => {
    // if (!context.state.user) return context.redirect('/signin')
    // return await domainCheck(context, next)
    await next()
  })

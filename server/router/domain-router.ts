import Router from 'koa-router'
import { getRepository } from 'typeorm'
import { User } from '../entities'
import { AuthError } from '../errors/auth-error'
import { jwtAuthenticateMiddleware } from '../middlewares'
import { getToken } from '../utils/get-token'
export const domainRouter = new Router()
domainRouter.use(jwtAuthenticateMiddleware)

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

    const user = await getRepository(User).findOne({
      where: {
        id: decodedToken.id
      },
      relations: ['domain', 'domains']
    })

    if (!user)
      throw new AuthError({
        errorCode: AuthError.ERROR_CODES.USER_NOT_FOUND
      })

    const userDomain = await user?.domain
    if (userDomain?.subdomain != domainName) return context.redirect(`/checkin/${domainName}`)

    return next()
  } catch (e) {
    const { originalUrl } = context
    return context.redirect(`/signin?redirect_to=${originalUrl}`)
  }
}

domainRouter
  .get('*', async (context, next) => {
    getToken(context)
    return await next()
  })
  .get('/', async (context, next) => {
    if (!context.state.user) return context.redirect('/signin')
    return context.redirect('/default-domain')
  })
  .get('/domain/:domainName', async (context, next) => {
    return await domainCheck(context, next)
  })
  .get('/domain/:domainName/*', async (context, next) => {
    return await domainCheck(context, next)
  })

import passport from 'koa-passport'
import unless from 'koa-unless'
import { jwtAuthenticateMiddleware } from './jwt-authenticate-middleware'
;(jwtAuthenticateMiddleware as any).unless = unless

var graphqlAuthMiddleware = async (context, next) => {
  try {
    if (context.state.error || !context.state.user) {
      context.status = 401
      context.body = {
        message: context.state.error.message
      }
      return
    }

    return next()
  } catch (e) {}
}

;(graphqlAuthMiddleware as any).unless = unless

const AUTH_CHECK_URLS = ['graphql']

process.on('bootstrap-module-middleware' as any, app => {
  let unlessOption = {
    path: [new RegExp(`^(?!\/?(${AUTH_CHECK_URLS.join('|')})(?![^/]))`)]
  }
  ;(app as any).use(passport.initialize())
  ;(app as any).use((jwtAuthenticateMiddleware as any).unless(unlessOption))
  // ;(app as any).use((graphqlAuthMiddleware as any).unless(unlessOption))
})

export * from './jwt-authenticate-middleware'
export * from './signin-middleware'

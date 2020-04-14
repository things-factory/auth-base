import passport from 'koa-passport'
import unless from 'koa-unless'
import { jwtAuthenticateMiddleware } from './jwt-authenticate-middleware'
;(jwtAuthenticateMiddleware as any).unless = unless

const AUTH_CHECK_URLS = ['graphql']

/* TODO authcheck 화이트리스트를 모듈에서 추가할 수 있는 방법을 제시해야 한다. */
process.on('bootstrap-module-middleware' as any, app => {
  let unlessOption = {
    path: [new RegExp(`^(?!\/?(${AUTH_CHECK_URLS.join('|')})(?![^/]))`)]
  }
  ;(app as any).use(passport.initialize())
  ;(app as any).use((jwtAuthenticateMiddleware as any).unless(unlessOption))
})

export * from './jwt-authenticate-middleware'
export * from './signin-middleware'

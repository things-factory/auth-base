import unless from 'koa-unless'
import { authMiddleware } from './auth-middleware'
import { jwtAuthenticateMiddleware } from './jwt-authenticate-middleware'
;(authMiddleware as any).unless = unless

// const AUTH_CHECK_URLS = [
//   'graphql',
//   'file',
//   'uploads',
//   'checkin',
//   'profile',
//   'update-profile',
//   'change_pass',
//   'delete-account'
// ]

/* TODO authcheck 화이트리스트를 모듈에서 추가할 수 있는 방법을 제시해야 한다. */
process.on('bootstrap-module-middleware' as any, app => {
  // ;(app as any).use((authMiddleware as any).unless(['graphql']))
  // ;(app as any).use(jwtAuthenticateMiddleware)
})

export * from './jwt-authenticate-middleware'
export * from './signin-middleware'

import unless from 'koa-unless'
import { authMiddleware } from './auth-middleware'
;(authMiddleware as any).unless = unless

process.on('bootstrap-module-middleware' as any, app => {
  /* 아래의 path로 시작하는 경우에만, authcheck를 한다. */
  let unlessOption = { path: [/^(?!.graphql|.file|.uploads|.authcheck|.change_pass).*$/] }
  ;(app as any).use((authMiddleware as any).unless(unlessOption))
})

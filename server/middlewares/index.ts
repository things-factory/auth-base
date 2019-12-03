import unless from 'koa-unless'
import { authMiddleware } from './auth-middleware'
;(authMiddleware as any).unless = unless

/* TODO authcheck 화이트리스트를 모듈에서 추가할 수 있는 방법을 제시해야 한다. */
process.on('bootstrap-module-middleware' as any, app => {
  /* 아래의 path로 시작하는 경우에만, authcheck를 한다. */
  let unlessOption = {
    path: [
      /^(?!.graphql|.file|.uploads|.authcheck|.update-profile|.change_pass|.resend-verification-email|.delete-account).*$/
    ]
  }
  ;(app as any).use((authMiddleware as any).unless(unlessOption))
})

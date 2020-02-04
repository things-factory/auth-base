import unless from 'koa-unless'
import { authMiddleware } from './auth-middleware'
;(authMiddleware as any).unless = unless

const AUTH_CHECK_URLS = [
  'graphql',
  'file',
  'uploads',
  'checkin',
  'profile',
  'update-profile',
  'change_pass',
  'delete-account'
]

/* TODO authcheck 화이트리스트를 모듈에서 추가할 수 있는 방법을 제시해야 한다. */
process.on('bootstrap-module-middleware' as any, (app: any) => {
  /* 아래의 path로 시작하는 경우에만, authcheck를 한다. */
  let unlessOption = {
    path: [new RegExp(`^(?!\/?(${AUTH_CHECK_URLS.join('|')})(?![^/]))`)]
  }
  app.use((authMiddleware as any).unless(unlessOption))
})

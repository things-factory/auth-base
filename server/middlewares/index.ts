import unless from 'koa-unless'
import { authMiddleware } from './auth-middleware'
import { authDomainMiddleware } from './auth-domain-middleware'
;(authMiddleware as any).unless = unless
;(authDomainMiddleware as any).unless = unless

const AUTH_CHECK_URLS = ['graphql', 'file', 'uploads', 'authcheck', 'update-profile', 'change_pass', 'delete-account']
const DOMAIN_CHECK_URLS = ['graphql']

/* TODO authcheck 화이트리스트를 모듈에서 추가할 수 있는 방법을 제시해야 한다. */
process.on('bootstrap-module-middleware' as any, app => {
  /* 아래의 path로 시작하는 경우에만, authcheck를 한다. */
  let unlessOptions = {
    auth: {
      path: [new RegExp(`^(?!\/(${AUTH_CHECK_URLS.join('|')})(?![^/]))`)]
    },
    domain: {
      path: [new RegExp(`^(?!\/(${DOMAIN_CHECK_URLS.join('|')})(?![^/]))`)]
    }
  }
  ;(app as any).use((authMiddleware as any).unless(unlessOptions.auth))
  ;(app as any).use((authDomainMiddleware as any).unless(unlessOptions.domain))
})

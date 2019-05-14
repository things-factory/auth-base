import unless from 'koa-unless'
import { authMiddleware } from './auth-middleware'
;(authMiddleware as any).unless = unless

/* 아래의 path로 시작하는 경우에만, authcheck를 한다. */
;(authMiddleware as any).unless({ path: [/^(?!.graphql|.file|.uploads|.authcheck).*$/] })

export const middlewares = [authMiddleware]

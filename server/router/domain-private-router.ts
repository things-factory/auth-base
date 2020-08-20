import Router from 'koa-router'
import { domainMiddleware } from '@things-factory/shell'
import { jwtAuthenticateMiddleware, domainAuthenticateMiddleware } from '../middlewares'

export const domainPrivateRouter = new Router()

domainPrivateRouter.use(domainMiddleware)
domainPrivateRouter.use(jwtAuthenticateMiddleware)
domainPrivateRouter.use(domainAuthenticateMiddleware)

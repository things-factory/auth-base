import Router from 'koa-router'
import { jwtAuthenticateMiddleware } from '../middlewares'

export const globalPrivateRouter = new Router()

globalPrivateRouter.use(jwtAuthenticateMiddleware)

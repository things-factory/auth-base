import koaBodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { signinMiddleware } from '../middlewares'

export const signinRouter = new Router()
signinRouter.use(signinMiddleware)

const bodyParserOption = {
  formLimit: '10mb',
  jsonLimit: '10mb',
  textLimit: '10mb'
}
// for authentication
signinRouter.post('/signin', async (context, next) => {})

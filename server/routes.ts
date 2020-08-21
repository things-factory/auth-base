import { jwtAuthenticateMiddleware, domainAuthenticateMiddleware } from './middlewares'
import {
  authPublicProcessRouter,
  authPrivateProcessRouter,
  authSigninPassportRouter,
  pathBaseDomainRouter
} from './router'

const debug = require('debug')('things-factory:auth-base:routes')

process.on('bootstrap-module-history-fallback' as any, (app, fallbackOption) => {
  var paths = [
    // static pages
    'signin',
    'signup',
    'signout',
    'default-domain',
    'domain-select',
    'forgot-password',
    'reset-password',
    'unlock-account',
    'activate',
    'result',
    // apis
    'checkin',
    'profile',
    'verify',
    'update-profile',
    'delete-account'
    // 'domain'
  ]
  fallbackOption.whiteList.push(`^\/(${paths.join('|')})($|[/?#])`)
})

process.on('bootstrap-module-global-public-route' as any, (app, globalPublicRouter) => {
  debug('bootstrap-module-global-public-route')

  globalPublicRouter.use('', authPublicProcessRouter.routes(), authPublicProcessRouter.allowedMethods())
})

process.on('bootstrap-module-global-private-route' as any, (app, globalPrivateRouter) => {
  globalPrivateRouter.use(jwtAuthenticateMiddleware)
})

process.on('bootstrap-module-domain-public-route' as any, (app, domainPublicRouter) => {
  debug('bootstrap-module-domain-public-route')

  /* app based nested-routers */
  domainPublicRouter.use('', authSigninPassportRouter.routes(), authSigninPassportRouter.allowedMethods())
  domainPublicRouter.use('', authPrivateProcessRouter.routes(), authPrivateProcessRouter.allowedMethods())
})

process.on('bootstrap-module-domain-private-route' as any, (app, domainPrivateRouter) => {
  domainPrivateRouter.use(jwtAuthenticateMiddleware)
  domainPrivateRouter.use(domainAuthenticateMiddleware)

  /* domainPrivateRouter based nested-routers */
  domainPrivateRouter.use('/domain', pathBaseDomainRouter.routes(), pathBaseDomainRouter.allowedMethods())
})

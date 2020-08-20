import {
  globalPrivateRouter,
  domainPrivateRouter,
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

process.on('bootstrap-module-domain-public-route' as any, (app, domainRouter) => {
  debug('bootstrap-module-domain-public-route')

  process.emit('bootstrap-module-domain-private-route' as any, app, domainPrivateRouter)

  /* domainPrivateRouter based nested-routers */
  domainPrivateRouter.use('/domain', pathBaseDomainRouter.routes(), pathBaseDomainRouter.allowedMethods())

  /* app based nested-routers */
  app.use(domainPrivateRouter.routes(), domainPrivateRouter.allowedMethods())
  app.use(authSigninPassportRouter.routes(), authSigninPassportRouter.allowedMethods())
  app.use(authPrivateProcessRouter.routes(), authPrivateProcessRouter.allowedMethods())
})

process.on('bootstrap-module-global-public-route' as any, (app, globalRouter) => {
  debug('bootstrap-module-global-public-route')

  process.emit('bootstrap-module-global-private-route' as any, app, globalPrivateRouter)

  /* app based nested-routers */
  app.use(globalPrivateRouter.routes(), globalPrivateRouter.allowedMethods())
  app.use(authPublicProcessRouter.routes(), authPublicProcessRouter.allowedMethods())
})

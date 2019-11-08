import { store } from '@things-factory/shell'
import { updateAuthenticated, updateUser, updateDomains } from './actions/auth'
import { auth } from './auth'
import reducerAuth from './reducers/auth'

export default function bootstrap() {
  store.addReducers({
    auth: reducerAuth
  })

  auth.on('signin', ({ accessToken, domains }) => {
    store.dispatch(updateAuthenticated(true))
    store.dispatch(updateDomains(domains))
  })

  auth.on('signout', () => {
    store.dispatch(updateAuthenticated(false))
    store.dispatch(updateDomains([]))
  })

  auth.on('profile', ({ credential, domains }) => {
    store.dispatch(updateUser(credential))
    store.dispatch(updateDomains(domains))
  })

  auth.on('domain-not-available', ({ credential, domains }) => {
    store.dispatch(updateUser(credential))
    store.dispatch(updateDomains(domains))
  })

  auth.on('changePassword', result => {
    //question mark boolean (true or false)
    let message = result ? 'Password Change Successfully' : 'Failed to Change Password'
    document.dispatchEvent(
      new CustomEvent('notify', {
        detail: {
          level: result ? 'info' : 'error',
          message
        }
      })
    )
  })
}

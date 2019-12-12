import { store, updateDomains } from '@things-factory/shell'
import { updateAuthenticated, updateUser } from './actions/auth'
import { auth } from './auth'
import reducerAuth from './reducers/auth'

export default function bootstrap() {
  store.addReducers({
    auth: reducerAuth
  })

  auth.on('profile', ({ credential, domains }) => {
    store.dispatch(
      updateAuthenticated({
        authenticated: true
      })
    )
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

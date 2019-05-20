import { store } from '@things-factory/shell'
import { auth } from './auth'
import reducerAuth from './reducers/auth'
import { updateAuthenticated, updateUser } from './actions/auth'

export default function bootstrap() {
  store.addReducers({
    auth: reducerAuth
  })

  auth.on('signin', accessToken => {
    store.dispatch(updateAuthenticated(true))
  })

  auth.on('signout', () => {
    store.dispatch(updateAuthenticated(false))
  })

  auth.on('profile', profile => {
    store.dispatch(updateUser(profile))
  })

  auth.on('changePassword', result => {
    //question mark boolean (true or false)
    let message = result ? 'Password Change Successfully' : 'Failed to Change Password'
    document.dispatchEvent(
      new CustomEvent('notify', {
        detail: {
          type: result ? 'info' : 'error',
          message
        }
      })
    )
  })
}

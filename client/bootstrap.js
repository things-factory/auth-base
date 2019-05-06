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

  auth.on('changePassword', formData => {
    console.log(formData)
  })
}

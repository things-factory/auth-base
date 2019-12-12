import { SET_AUTH, SET_PROFILE } from '../actions/auth.js'

const INITIAL_STATE = {
  authenticated: false,
  accessToken: '',
  user: null
}

const auth = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_AUTH:
      let auth = action.auth

      return {
        ...state,
        authenticated: auth.authenticated,
        accessToken: auth.accessToken
      }

    case SET_PROFILE:
      return {
        ...state,
        user: action.user
      }

    default:
      return state
  }
}

export default auth

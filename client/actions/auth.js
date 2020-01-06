export const SET_PROFILE = 'SET-PROFILE'
export const SET_AUTH = 'SET-AUTH'

export const updateUser = user => (dispatch, getState) => {
  dispatch({
    type: SET_PROFILE,
    user
  })
}

export const updateAuthenticated = auth => (dispatch, getState) => {
  dispatch({
    type: SET_AUTH,
    auth
  })
}

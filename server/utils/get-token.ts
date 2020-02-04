import { TOKEN_EXPIRES_IN } from '../constants/token-expires-in'
export function getAccessToken(context) {
  const { query, headers, secure } = context
  let searchParamToken = query.token
  let headerToken = headers['x-access-token'] || headers['authorization']
  let token = context.cookies.get('access_token') || searchParamToken || headerToken

  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length)
  }

  if (searchParamToken || headerToken) {
    context.cookies.set('access_token', token, {
      secure,
      httpOnly: true,
      maxAge: TOKEN_EXPIRES_IN
    })
  }

  return token
}

export function getRefreshToken(context) {
  const { query, headers } = context
  let searchParamToken = query.token
  let headerToken = headers['x-refresh-token'] || headers['authorization']
  let token = context.cookies.get('refresh_token') || searchParamToken || headerToken

  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length)
  }

  return token
}

export function getTokens(context) {
  const accessToken = getAccessToken(context)
  const refreshToken = getRefreshToken(context)

  return {
    accessToken,
    refreshToken
  }
}

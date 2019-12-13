export function getToken(context) {
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
      httpOnly: true
    })
  }

  return token
}

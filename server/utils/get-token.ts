export function getToken(context) {
  const req = context.request

  var token =
    context.cookies.get('access_token') ||
    req.headers['x-access-token'] ||
    req.headers['authorization'] ||
    req.query.token ||
    null

  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    return token.slice(7, token.length)
  }

  return token
}

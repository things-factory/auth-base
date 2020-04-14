export async function getDefaultDomain(userInfo, fallbackUrl = '/domain-select') {
  let redirectTo = fallbackUrl

  const userDomain = await userInfo.domain
  if (userDomain) redirectTo = `/checkin/${userDomain.subdomain}`

  return redirectTo
}

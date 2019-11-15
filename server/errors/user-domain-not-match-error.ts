import { AuthError } from './auth-error'
import { UNAVAILABLE_DOMAIN } from '../constants/error-code'

export class UserDomainNotMatchError extends AuthError {
  domains: any
  constructor({ errorCode = UNAVAILABLE_DOMAIN, domains }) {
    super({
      errorCode
    })
    this.name = 'user-domain-not-match'
    this.domains = domains
  }
}

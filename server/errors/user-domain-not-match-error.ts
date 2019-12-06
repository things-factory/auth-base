import {
  NO_AVAILABLE_DOMAIN,
  NO_SELECTED_DOMAIN,
  REDIRECT_TO_DEFAULT_DOMAIN,
  UNAVAILABLE_DOMAIN
} from '../constants/error-code'
import { AuthError } from './auth-error'

export class DomainError extends AuthError {
  static get ERROR_CODES(): any {
    return {
      UNAVAILABLE_DOMAIN,
      NO_AVAILABLE_DOMAIN,
      NO_SELECTED_DOMAIN,
      REDIRECT_TO_DEFAULT_DOMAIN
    }
  }
  domains: any
  constructor({ errorCode = UNAVAILABLE_DOMAIN, domains }) {
    super({
      errorCode
    })
    this.name = 'user-domain-not-match'
    this.domains = domains
  }
}

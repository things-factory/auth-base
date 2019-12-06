import * as ERROR_CODES from '../constants/error-code'
export class AuthError extends Error {
  static get ERROR_CODES(): any {
    return {
      ...ERROR_CODES
    }
  }
  errorCode: any
  constructor({ errorCode }) {
    super(errorCode)
    this.name = 'auth-error'
    this.errorCode = errorCode
  }
}

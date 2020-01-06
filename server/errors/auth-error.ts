import * as ERROR_CODES from '../constants/error-code'

type AuthErrorArgument = {
  errorCode: string
  detail?: Object
}
export class AuthError extends Error {
  static get ERROR_CODES(): any {
    return {
      ...ERROR_CODES
    }
  }
  errorCode: any
  detail: Object
  constructor({ errorCode, detail }: AuthErrorArgument) {
    super(errorCode)
    this.name = 'auth-error'
    this.errorCode = errorCode
    this.detail = detail
  }
}

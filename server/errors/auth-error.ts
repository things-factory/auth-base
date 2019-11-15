export class AuthError extends Error {
  errorCode: any
  constructor({ errorCode }) {
    super(errorCode)
    this.name = 'auth-error'
    this.errorCode = errorCode
  }
}

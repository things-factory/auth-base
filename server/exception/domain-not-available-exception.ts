export class DomainNotAvailableException extends Error {
  domains: any
  constructor({ message, domains }) {
    super(message)
    this.name = 'DomainNotAvailable'
    this.domains = domains
  }
}

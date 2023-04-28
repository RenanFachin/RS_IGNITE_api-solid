export class LateCheckInValidationError extends Error {
  constructor() {
    // super é um método de Error
    super('The check-in can only be validated until 20 minutes of its creation')
  }
}

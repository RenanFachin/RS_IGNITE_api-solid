export class InvalidCredentialsError extends Error {
  constructor() {
    // super é um método de Error
    super('Invalid credentials.')
  }
}

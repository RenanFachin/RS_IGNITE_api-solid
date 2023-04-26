export class UserAlreadyExistsError extends Error {
  constructor() {
    // super é um método de Error
    super('E-mail already exists.')
  }
}

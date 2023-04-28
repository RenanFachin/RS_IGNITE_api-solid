export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    // super é um método de Error
    super('Max number of check-ins reached.')
  }
}

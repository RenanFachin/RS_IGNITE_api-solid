export class MaxDistanceError extends Error {
  constructor() {
    // super é um método de Error
    super('Max distance reached.')
  }
}

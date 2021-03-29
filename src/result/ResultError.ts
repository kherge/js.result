/**
 * A `Result` related error.
 */
class ResultError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ResultError.prototype);
  }
}

export default ResultError;

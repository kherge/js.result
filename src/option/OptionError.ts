/**
 * An error that is thrown for an `Option` related error.
 */
class OptionError extends Error {
  /**
   * Initializes the new error.
   *
   * @param message The error message.
   */
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, OptionError.prototype);
  }
}

export default OptionError;

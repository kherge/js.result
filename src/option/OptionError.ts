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

    this.name = 'OptionError';

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default OptionError;

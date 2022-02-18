import { Produce } from '../types';
import Err from './Err';
import Ok from './Ok';
import Result from './Result';

/**
 * Invokes a function that may throw an error and returns a `Result`.
 *
 * The given function is invoked within a try/catch block. If an error is caught, it is returned
 * as an instance of `Err`. If no error is thrown, then the result is returned as an instance of
 * `Ok`.
 *
 * > It is important to know that this function is unable to determine the proper type of the
 * > thrown error. While the type defaults to the built-in JavaScript `Error` type, it is very
 * > much encouraged that you specify the error type.
 *
 * ```ts
 * // A simple function that can throw an error.
 * const throws = (fail: boolean) => {
 *   if (fail) {
 *     throw new Error("An example error.");
 *   }
 *
 *   return "example";
 * };
 *
 * // An example of the error being caught.
 * let result: Result<string, Error> = attempt(() => throws(true));
 *
 * assert(result.isErr() === true);
 *
 * // An example of the result being returned.
 * result = attempt(() => throws(false));
 *
 * assert(result.isOk() === true);
 * ```
 *
 * @typeparam E The type of the thrown value.
 * @typeparam T The type of the function's return value.
 *
 * @param fn The function to invoke.
 *
 * @returns A `Result` for the function return value.
 */
export const attempt = <T, E = Error>(fn: Produce<T>): Result<T, E> => {
  try {
    return ok(fn());
  } catch (error) {
    return err(error as E);
  }
};

/**
 * Creates a new instance of `Err`.
 *
 * ```ts
 * let result: Result<string, string> = err('error');
 *
 * assert(result.isErr() === true);
 * ```
 *
 * @typeParam T The type of the success value.
 * @typeParam E The type of the failure value.
 *
 * @param value The failure value.
 *
 * @return The instance.
 */
export const err = <T, E>(value: E) => new Err<T, E>(value);

/**
 * Creates a new instance of `Ok`.
 *
 * ```ts
 * let result: Result<string, string> = ok('value');
 *
 * assert(result.isOk() === true);
 * ```
 *
 * @typeParam T The type of the success value.
 * @typeParam E The type of the failure value.
 *
 * @param value The success value.
 *
 * @return The instance.
 */
export const ok = <T, E>(value: T) => new Ok<T, E>(value);

// Re-export some parts.
export { default as Result } from './Result';

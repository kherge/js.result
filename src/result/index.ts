import Err from './Err';
import Ok from './Ok';

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

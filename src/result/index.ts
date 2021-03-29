import Err from './Err';
import Ok from './Ok';

/**
 * Creates a new instance of `Err`.
 *
 * ```ts
 * let result = err('error');
 *
 * assert(result.isErr() === true);
 * ```
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
 * let result = ok('value');
 *
 * assert(result.isOk() === true);
 * ```
 *
 * @param value The success value.
 *
 * @return The instance.
 */
export const ok = <T, E>(value: T) => new Ok<T, E>(value);

// Re-export some parts.
export { default as Result } from './Result';

import None from './None';
import Some from './Some';

/**
 * Wraps a value as an `Option`.
 *
 * This function provides a convenient way of wrapping the result of a function that could return
 * `null` or `undefined`. If `null` or `undefined` is given, an instance of `None` is returned. If
 * any other value is provided, including other falsy values, an instance of `Some` is returned.
 *
 * ```ts
 * let option: Option<string> = maybe(null);
 *
 * assert(option.isNone() === true);
 *
 * option = maybe("example");
 *
 * assert(option.isSome() === true);
 * ```
 *
 * @typeParam T The type of the value.
 *
 * @return The instance.
 */
export const maybe = <T>(value: T) => {
  if (value == null || value === undefined) {
    return none();
  }

  return some(value);
};

/**
 * Creates a new instance of `None`.
 *
 * ```ts
 * let option: Option<string> = none();
 *
 * assert(option.isNone() === true);
 * ```
 *
 * @typeParam T The type of the value.
 *
 * @return The instance.
 */
export const none = <T>() => new None<T>();

/**
 * Creates a new instance of `Some`.
 *
 * ```ts
 * let option: Option<string> = some('example');
 *
 * assert(option.isSome() === true);
 * ```
 *
 * @typeParam T The type of the value.
 *
 * @param value The value to wrap.
 *
 * @return The instance.
 */
export const some = <T>(value: T) => new Some(value);

// Re-export some parts.
export { default as Option } from './Option';

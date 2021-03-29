import None from './None';
import Some from './Some';

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

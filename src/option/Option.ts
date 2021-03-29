import type { Compute, Predicate, Produce } from "../types";
import type { Result } from "../result";

/**
 * Manages access to a value that may or may not be present.
 *
 * ```ts
 * let option: Option<string>;
 *
 * // A value that is present.
 * option = some('value');
 *
 * // A value that is absent.
 * option = none();
 * ```
 */
 interface Option<T> {
  /**
   * Returns the `other` option if this option is `Some`.
   *
   * ```ts
   * let option = some('example');
   * let other = some(123);
   * let result = option.and(other);
   *
   * assert(result === other);
   * ```
   *
   * If this option is `None`, then `None` is returned.
   *
   * ```ts
   * option = none();
   * result = option.and(other);
   *
   * assert(result.isNone() === true);
   * ```
   *
   * @param other The other option.
   *
   * @return The `other` option, or `None`.
   */
  and<U>(other: Option<U>): Option<U>;

  /**
   * Maps and returns this option if it is `Some`.
   *
   * ```ts
   * let option = some('example');
   * let fn = v => some(v.length);
   * let result = option.andThen(fn);
   *
   * assert(result.unwrap() === 7);
   * ```
   *
   * If this option is `None`, then `None` is returned.
   *
   * ```ts
   * option = none();
   * result = option.andThen(fn);
   *
   * assert(result.isNone() === true);
   * ```
   *
   * @param fn The option mapper.
   *
   * @returns The mapped option, or `None`.
   */
  andThen<U>(fn: Compute<T, Option<U>>): Option<U>;

  /**
   * Returns the value in this option if it is `Some`.
   *
   * ```ts
   * let error = 'The example error message.';
   * let option = some('example');
   * let result = option.expect(error);
   *
   * assert(result === 'example');
   * ```
   *
   * If this option is `None`, then an error is thrown.
   *
   * ```ts
   * option = none();
   * result = option.expect(error);
   *
   * // error thrown using given message
   * ```
   *
   * @param message The error message.
   *
   * @return The value in this option.
   */
  expect(message: string): T;

  /**
   * Returns this option if the `predicate` returns `true`.
   *
   * ```ts
   * let option = some('example');
   * let predicate = o => o === 'example';
   * let result = option.filter(predicate);
   *
   * assert(result === option);
   * ```
   *
   * If the `predicate` returns `false`, then `None` is returned.
   *
   * ```ts
   * option = some('other');
   * result = option.filter(predicate);
   *
   * assert(result.isNone() === true);
   * ```
   *
   * If the option is `None`, then `None` is returned.
   *
   * ```ts
   * option = none();
   * result = option.filter(predicate);
   *
   * assert(result.isNone() === true);
   * ```
   *
   * @param predicate The predicate to apply.
   *
   * @returns This option or `None`.
   */
  filter(predicate: Predicate<T>): Option<T>;

  /**
   * Returns the value in this option if `Some`.
   *
   * ```ts
   * let option = some('example');
   * let other = 'other';
   * let result = option.getOrInsert(other);
   *
   * assert(result === 'example');
   * ```
   *
   * If this option is `None`, this option becomes `Some` and the given value is set and returned.
   *
   * ```ts
   * option = none();
   * result = option.getOrOinsert(other);
   *
   * assert(result === other);
   * assert(option.isSome() === true);
   * assert(option.unwrap() === other);
   * ```
   *
   * @param value The value to insert.
   *
   * @return The value in this option or the given value.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf} For details on performance impact.
   */
  getOrInsert(value: T): T;

  /**
   * Returns the value in this option if `Some`.
   *
   * ```ts
   * let option = some('example');
   * let other = () => 'other';
   * let result = option.getOrInsertWith(other);
   *
   * assert(result === 'example');
   * ```
   *
   * If this option is `None`, the value is produced and this option becomes `Some` with the
   * produced value set. The produced value is then returned.
   *
   * ```ts
   * option = none();
   * result = option.getOrOinsertWith(other);
   *
   * assert(result === 'other');
   * assert(option.isSome() === true);
   * assert(option.unwrap() === other);
   * ```
   *
   * @param fn The producer for value to insert.
   *
   * @return The value in this option or the given value.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf} For details on performance impact.
   */
  getOrInsertWith(fn: Produce<T>): T;

  /**
   * Returns `true` if this option is `None`.
   *
   * ```ts
   * let option = none();
   *
   * assert(option.isNone() === true);
   * ```
   *
   * @return If this option is `None`, then `true`. Otherwise, `false`.
   */
  isNone(): boolean;

  /**
   * Returns `true` if the option is `Some`.
   *
   * ```ts
   * let option = some('example');
   *
   * assert(option.isSome() === true);
   * ```
   *
   * @return If this option is `Some`, then` true`. Otherwise, `false`.
   */
  isSome(): boolean;

  /**
   * Returns the mapped option if this option is `Some`.
   *
   * ```ts
   * let fn = o => o.length;
   * let option = some('example');
   * let result = option.map(fn);
   *
   * assert(result.unwrap() === 7);
   * ```
   *
   * If this option is `None`, then `None` is returned.
   *
   * @param fn The mapping function.
   *
   * @return The mapped option or `None`.
   */
  map<U>(fn: Compute<T, U>): Option<U>;

  /**
   * Returns the mapped value if this option is `Some`.
   *
   * ```ts
   * let def = 456;
   * let fn = o => o.length;
   * let option = some('example');
   * let result = option.mapOr(def, fn);
   *
   * assert(result.unwrap() === 7);
   * ```
   *
   * If the option is `None`, then the default value is returned.
   *
   * ```ts
   * option = none();
   * result = option.mapOr(def, fn);
   *
   * assert(result.unwrap() === 456);
   * ```
   *
   * @param def The default value.
   * @param fn  The mapping function.
   *
   * @return The mapped or default value.
   */
  mapOr<U>(def: U, fn: Compute<T, U>): U;

  /**
   * Returns the mapped value if this option is `Some`.
   *
   * ```ts
   * let def = () => 456;
   * let fn = o => o.length;
   * let option = some('example');
   * let result = option.mapOrElse(def, fn);
   *
   * assert(result.unwrap() === 7);
   * ```
   *
   * If this option is `None`, then the default value is produced and returned.
   *
   * ```ts
   * option = none();
   * result = option.mapOrElse(def, fn);
   *
   * assert(result.unwrap() === 456);
   * ```
   *
   * @param def The default value producer.
   * @param fn  The mapping function.
   *
   * @return The mapped or default value.
   */
  mapOrElse<U>(def: Produce<U>, fn: Compute<T, U>): U;

  /**
   * Transforms this option into `Ok<T, E>` if it is `Some.
   *
   * ```ts
   * let error = 'error';
   * let option = some('example');
   * let result = option.okOr(error);
   *
   * assert(result.isOk() === true);
   * ```
   *
   * If this option is `None`, the option is transformed into `Err<T, E>`.
   *
   * ```ts
   * option = none();
   * result = option.okOr(error);
   *
   * assert(result.isErr() === true);
   * ```
   *
   * @param error The possible error.
   *
   * @return The result.
   */
  okOr<E>(error: E): Result<T, E>;

  /**
   * Transforms this `Option<T>` into `Ok<T, E>` if it is `Some`.
   *
   * ```ts
   * let error = () => 'error';
   * let option = some('example');
   * let result = option.okOrElse(error);
   *
   * assert(result.isOk() === true);
   * ```
   *
   * If this option is `None`, the `Err<T, E>` is produced and returned.
   *
   * ```ts
   * option = none();
   * result = option.okOrElse(error);
   *
   * assert(result.isErr() === true);
   * ```
   *
   * @param error The producer for the possible error.
   *
   * @return The result.
   */
  okOrElse<E>(error: Produce<E>): Result<T, E>;

  /**
   * Returns this option if `Some`.
   *
   * ```ts
   * let option = some('example');
   * let other = some('other');
   * let result = option.or(other);
   *
   * assert(result === option);
   * ```
   *
   * If this option is `None`, the `other` option is returned.
   *
   * ```ts
   * option = none();
   * result = option.or(other);
   *
   * assert(result === other);
   * ```
   *
   * @param other The other option.
   *
   * @returns This or the other option.
   */
  or(other: Option<T>): Option<T>;

  /**
   * Returns this option if `Some`.
   *
   * ```this
   * let option = some('example');
   * let other = () => some('other');
   * let result = option.orElse(other);
   *
   * assert(result === option);
   * ```
   *
   * If this option is `None`, the other option is produced and returned.
   *
   * ```ts
   * option = none();
   * result = option.orElse(other);
   *
   * assert(result.unwrap() === 'other);
   * ```
   *
   * @param other The producer for the other option.
   *
   * @returns This or the other option.
   */
  orElse(other: Produce<Option<T>>): Option<T>;

  /**
   * Replaces the value in this option and returns the old one.
   *
   * ```ts
   * let option = some('example');
   * let result = option.replace('other');
   *
   * assert(result.unwrap() === 'example');
   * assert(option.unwrap() === 'other');
   * ```
   *
   * If this option is `None`, it will be converted to `Some`.
   *
   * ```ts
   * option = none();
   * result = option.replace('other');
   *
   * assert(result.isNone() === true);
   * assert(option.isSome() === true);
   * assert(option.unwrap() === 'other');
   * ```
   *
   * @param value The new value.
   *
   * @return The old value.
   *
   * @throws {OptionError} If not `Some`.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf} For details on performance impact.
   */
  replace(value: T): Option<T>;

  /**
   * Returns the value in this option.
   *
   * ```ts
   * let option = some('example');
   * let result = option.unwrap();
   *
   * assert(result === 'example');
   * ```
   *
   * @return The value.
   *
   * @throws {OptionError} If no value is present.
   */
  unwrap(): T;

  /**
   * Returns the value in this option if `Some`.
   *
   * ```ts
   * let def = 'default';
   * let option = some('example');
   * let result = option.unwrapOr(def);
   *
   * assert(result === 'example');
   * ```
   *
   * If this option is `None`, the default value is returned.
   *
   * ```ts
   * option = none();
   * result = option.unwrapOr(def);
   *
   * assert(result === def);
   * ```
   *
   * @param def The default value.
   *
   * @return The unwrapped or default value.
   */
  unwrapOr(def: T): T;

  /**
   * Returns this value in this option if `Some`.
   *
   * ```ts
   * let def = () => 'default';
   * let option = some('example');
   * let result = option.unwrapOrElse(def);
   *
   * assert(result === 'example');
   * ```
   *
   * If this option is `None`, the default value is produced and returned.
   *
   * ```this
   * option = none();
   * result = option.unwrapOrElse(def);
   *
   * assert(result === 'default');
   * ```
   *
   * @param def The producer for the default value.
   *
   * @return The unwrapped or default value.
   */
  unwrapOrElse(def: Produce<T>): T;

  /**
   * Returns this option if `Some` and the other option is `None`.
   *
   * ```ts
   * let option = some('example');
   * let other = none();
   * let result = option.xor(other);
   *
   * assert(result === option);
   * ```
   *
   * If this option is `None` and the other option is `Some`, the other option is returned.
   *
   * ```ts
   * option = none();
   * other = some('other');
   * result = option.xor(other);
   *
   * assert(result === other);
   * ```
   *
   * If this option is `Some` and the other option is `Some`, then `None` is returned.
   *
   * ```ts
   * option = some('example');
   * other = some('other');
   * result = option.xor(other);
   *
   * assert(result.isNone() === true);
   * ```
   *
   * @param other The other option.
   *
   * @returns This option, the other option, or `None`.
   */
  xor(other: Option<T>): Option<T>;

  /**
   * Returns this option and the other option, if both are `Some`, into a new `Some`.
   *
   * ```ts
   * let option = some('example');
   * let other = some('other');
   * let result = option.zip(other);
   *
   * assert(result.isSome() === true);
   *
   * let values = result.unwrap();
   *
   * assert(values[0] === 'example');
   * assert(values[1] === 'other');
   * ```
   *
   * @param other The other option.
   *
   * @returns The zipped option or `None`.
   */
  zip<U>(other: Option<U>): Option<[T, U]>;
}

export default Option;

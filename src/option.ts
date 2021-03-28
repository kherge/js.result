import { Compute, Map, Predicate } from './shared';
import { Result, err, ok } from './result';

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
export interface Option<T> {
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
  andThen<U>(fn: Map<T, Option<U>>): Option<U>;

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
  map<U>(fn: Map<T, U>): Option<U>;

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
  mapOr<U>(def: U, fn: Map<T, U>): U;

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
   * If this option is `None`, then the default value is computed and returned.
   *
   * ```ts
   * option = none();
   * result = option.mapOrElse(def, fn);
   *
   * assert(result.unwrap() === 456);
   * ```
   *
   * @param def The default value computer.
   * @param fn  The mapping function.
   *
   * @return The mapped or computed default value.
   */
  mapOrElse<U>(def: Compute<U>, fn: Map<T, U>): U;

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
   * If this option is `None`, the `Err<T, E>` is computed and returned.
   *
   * ```ts
   * option = none();
   * result = option.okOrElse(error);
   *
   * assert(result.isErr() === true);
   * ```
   *
   * @param error The possible error computer.
   *
   * @return The result.
   */
  okOrElse<E>(error: Compute<E>): Result<T, E>;

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
   * If this option is `None`, the other option is computed and returned.
   *
   * ```ts
   * option = none();
   * result = option.orElse(other);
   *
   * assert(result.unwrap() === 'other);
   * ```
   *
   * @param other The other option computer.
   *
   * @returns This or the other computed option.
   */
  orElse(other: Compute<Option<T>>): Option<T>;

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
   * @see Performance impact on {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf|MDN}.
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
   * If this option is `None`, the default value is computed and returned.
   *
   * ```this
   * option = none();
   * result = option.unwrapOrElse(def);
   *
   * assert(result === 'default');
   * ```
   *
   * @param def The default value computer.
   *
   * @return The unwrapped or computed default value.
   */
  unwrapOrElse(def: Compute<T>): T;

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

/**
 * Manages access to a value this is not present.
 */
class None<T> implements Option<T> {
  and<U>(_: Option<U>): Option<U> {
    return new None();
  }

  andThen<U>(_: Map<T, Option<U>>): Option<U> {
    return new None();
  }

  filter(_: Predicate<T>): Option<T> {
    return new None();
  }

  isNone(): boolean {
    return true;
  }

  isSome(): boolean {
    return false;
  }

  map<U>(_: Map<T, U>): Option<U> {
    return new None();
  }

  mapOr<U>(def: U, _: Map<T, U>): U {
    return def;
  }

  mapOrElse<U>(def: Compute<U>, _: Map<T, U>): U {
    return def();
  }

  okOr<E>(error: E): Result<T, E> {
    return err(error);
  }

  okOrElse<E>(error: Compute<E>): Result<T, E> {
    return err(error());
  }

  or(other: Option<T>): Option<T> {
    return other;
  }

  orElse(other: Compute<Option<T>>): Option<T> {
    return other();
  }

  replace(value: T): Option<T> {
    Object.setPrototypeOf(this, Some.prototype).value = value;

    return new None();
  }

  unwrap(): never {
    throw new OptionError('No value to unwrap.');
  }

  unwrapOr(def: T): T {
    return def;
  }

  unwrapOrElse(def: Compute<T>): T {
    return def();
  }

  xor(other: Option<T>): Option<T> {
    if (other.isSome()) {
      return other;
    }

    return new None();
  }

  zip<U>(_: Option<U>): Option<[T, U]> {
    return new None();
  }
}

/**
 * Creates a new instance of `None`.
 *
 * ```ts
 * let option = none();
 *
 * assert(option.isNone() === true);
 * ```
 *
 * @return The instance.
 */
export const none = <T>() => new None<T>();

/**
 * Manages access to a value that is present.
 */
class Some<T> implements Option<T> {
  /**
   * Wraps the optional value.
   *
   * @param value The value.
   */
  constructor(private value: T) {}

  and<U>(other: Option<U>): Option<U> {
    return other;
  }

  andThen<U>(fn: Map<T, Option<U>>): Option<U> {
    return fn(this.value);
  }

  filter(predicate: Predicate<T>): Option<T> {
    if (predicate(this.value)) {
      return this;
    }

    return new None();
  }

  isNone(): boolean {
    return false;
  }

  isSome(): boolean {
    return true;
  }

  map<U>(fn: Map<T, U>): Option<U> {
    return new Some(fn(this.value));
  }

  mapOr<U>(_: U, fn: Map<T, U>): U {
    return fn(this.value);
  }

  mapOrElse<U>(_: Compute<U>, fn: Map<T, U>): U {
    return fn(this.value);
  }

  okOr<E>(_: E): Result<T, E> {
    return ok(this.value);
  }

  okOrElse<E>(_: Compute<E>): Result<T, E> {
    return ok(this.value);
  }

  or(_: Option<T>): Option<T> {
    return this;
  }

  orElse(_: Compute<Option<T>>): Option<T> {
    return this;
  }

  replace(value: T) {
    const old = new Some(this.value);

    this.value = value;

    return old;
  }

  unwrap() {
    return this.value;
  }

  unwrapOr(_: T): T {
    return this.value;
  }

  unwrapOrElse(_: Compute<T>): T {
    return this.value;
  }

  xor(other: Option<T>): Option<T> {
    if (other.isNone()) {
      return this;
    }

    return new None();
  }

  zip<U>(other: Option<U>): Option<[T, U]> {
    if (other.isSome()) {
      return some([this.value, other.unwrap()]);
    }

    return new None();
  }
}

/**
 * Creates a new instance of `Some`.
 *
 * ```ts
 * let option = some('example');
 *
 * assert(option.isSome() === true);
 * ```
 *
 * @param value The value to wrap.
 *
 * @return The instance.
 */
export const some = <T>(value: T) => new Some(value);

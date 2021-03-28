import { Compute } from './shared';
import { Option, none, some } from './option';

/**
 * A `Result` related error.
 */
class ResultError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ResultError.prototype);
  }
}

/**
 * Manages access to a value that represents either success (`Ok`) or failure (`Err`).
 *
 * ```ts
 * let result: Result<string, number>;
 *
 * // A value for success.
 * result = ok('success');
 *
 * // A value for failure.
 * result = err(123);
 * ```
 */
export interface Result<T, E> {
  /**
   * Returns the `other` result if this result is `Ok`.
   *
   * ```ts
   * let result = ok('example');
   * let other = ok('other');
   * let output = result.and(other);
   *
   * assert(output === other);
   * ```
   *
   * If this result is `Err`, then this result is returned.
   *
   * ```ts
   * result = err(123);
   * output = result.and(other);
   *
   * assert(output === result);
   * ```
   *
   * @param other The other result.
   *
   * @return The `other` result or this `Err`.
   */
  and<U>(other: Result<U, E>): Result<U, E>;

  /**
   * Returns the computed `other` result if this result is `Ok`.
   *
   * ```ts
   * let result = ok('example');
   * let other = r => ok(r + ' other');
   * let output = result.and(other);
   *
   * assert(output.unwrap() === 'example other');
   * ```
   *
   * If this result is `Err`, then this result is returned.
   *
   * ```ts
   * result = err(123);
   * output = result.and(other);
   *
   * assert(output === result);
   * ```
   *
   * @param other The other result computer.
   *
   * @return The `other` result or this `Err`.
   */
  andThen<U>(other: Compute<T, Result<U, E>>): Result<U, E>;

  /**
   * Transforms this `Result<T, E>` into `Some<E>` if it is `Err`.
   *
   * ```ts
   * let result = err(123);
   * let output = result.err();
   *
   * assert(output.isSome() === true);
   * assert(output.unwrap() === 123);
   * ```
   *
   * If this result is `Ok`, then `None<E>` is returned.
   *
   * ```ts
   * result = ok('example');
   * output = result.err();
   *
   * assert(output.isNone());
   * ```
   *
   * @returns The option.
   */
  err(): Option<E>;

  /**
   * Returns the value in this result if `Ok`.
   *
   * ```ts
   * let error = 'Example error message.';
   * let result = ok('example');
   * let output = result.expect(error);
   *
   * assert(output === 'example');
   * ```
   *
   * If this result is `Err`, an error is thrown.
   *
   * ```ts
   * result = err(123);
   * output = result.expect(error);
   *
   * // throws error
   * ```
   *
   * @param error The error message.
   *
   * @return The value.
   *
   * @throws {ResultError} If this is `Err`.
   */
  expect(error: string): T;

  /**
   * Returns the value in this result if `Err`.
   *
   * ```ts
   * let error = 'Example error message.';
   * let result = err(123);
   * let output = result.expectErr(error);
   *
   * assert(output === 123);
   * ```
   *
   * If this result is `Ok`, an error is thrown.
   *
   * ```ts
   * result = ok('example');
   * output = result.expectErr(error);
   *
   * // throws error
   * ```
   *
   * @param error The error message.
   *
   * @return The value.
   *
   * @throws {ResultError} If this is `Ok`.
   */
  expectErr(error: string): E;

  /**
   * Returns `true` if this result is `Error`.
   *
   * ```ts
   * let result = err(123);
   * let output = result.isErr();
   *
   * assert(output === true);
   * ```
   *
   * If this result is `Ok`, then `false` is returned.
   *
   * ```ts
   * result = ok('example');
   * output = result.isErr();
   *
   * assert(output === false);
   * ```
   *
   * @returns Returns `true` if `Err`, or `false` if not.
   */
  isErr(): boolean;

  /**
   * Returns `true` if this result is `Ok`.
   *
   * ```ts
   * let result = ok('example');
   * let output = result.isOk();
   *
   * assert(output === true);
   * ```
   *
   * If this result is `Err`, then `false` is returned.
   *
   * ```ts
   * result = err(123);
   * output = result.isOk();
   *
   * assert(output === false);
   * ```
   *
   * @returns Returns `true` if `Ok`, or `false` if not.
   */
  isOk(): boolean;

  /**
   * Returns the mapped result if this result is `Ok.
   *
   * ```ts
   * let fn = r => r.length;
   * let result = ok('example');
   * let output = result.map(fn);
   *
   * assert(output.isOk() === true);
   * assert(output.unwrap() === 7);
   * ```
   *
   * If this result is `Err`, this result is returned.
   *
   * ```ts
   * result = err(123);
   * output = result.map(fn);
   *
   * assert(output === result);
   * ```
   *
   * @param fn The mapping function.
   *
   * @return The result.
   */
  map<U>(fn: Compute<T, U>): Result<U, E>;

  /**
   * Returns the mapped result if this result is `Err`.
   *
   * ```ts
   * let fn = r => r + 111;
   * let result = err(123);
   * let output = result.mapErr(fn);
   *
   * assert(output.isErr() === true);
   * assert(output.unwrap() === 456);
   * ```
   *
   * If this result is `Ok`, this result is returned.
   *
   * ```ts
   * result = ok('example');
   * output = result.mapErr(fn);
   *
   * assert(output === result);
   * ```
   *
   * @param fn The mapping function.
   *
   * @returns The mapped result or this result.
   */
  mapErr<F>(fn: Compute<E, F>): Result<T, F>;

  /**
   * Returns the mapped value if this result is `Ok`.
   *
   * ```ts
   * let def = 456;
   * let fn = r => r.length;
   * let result = ok('example');
   * let output = result.mapOr(def, fn);
   *
   * assert(output === 7);
   * ```
   *
   * If this result is `Err`, then the default value is returned.
   *
   * ```ts
   * result = err(123);
   * output = result.mapOr(def, fn);
   *
   * assert(output === 456);
   * ```
   *
   * @param def The default value.
   * @param fn  The mapping function.
   *
   * @return The mapped or default value.
   */
  mapOr<U>(def: U, fn: Compute<T, U>): U;

  /**
   * Returns the mapped value if this result is `Ok`.
   *
   * ```ts
   * let def = r => r + 333;
   * let fn = r => r.length;
   * let result = ok('example');
   * let output = result.mapOr(def, fn);
   *
   * assert(output === 7);
   * ```
   *
   * If this result is `Err`, then the default value is computed and returned.
   *
   * ```ts
   * result = err(123);
   * output = result.mapOrElse(def, fn);
   *
   * assert(output === 456);
   * ```
   *
   * @param def The default value computer.
   * @param fn  The mapping function.
   *
   * @return The mapped or computed default value.
   */
  mapOrElse<U>(def: Compute<E, U>, fn: Compute<T, U>): U;

  /**
   * Converts this result to `Some<T>` if this result is `Ok`.
   *
   * ```ts
   * let result = ok('example');
   * let output = result.ok();
   *
   * assert(output.isSome() === true);
   * assert(output.unwrap() === 'example');
   * ```
   *
   * If this result is `Err`, then `None<T>` is returned.
   *
   * ```ts
   * result = err(123);
   * output = result.ok();
   *
   * assert(output.isNone() === true);
   * ```
   *
   * @return Returns `Some` if `Ok`, or `None` if `Error`.
   */
  ok(): Option<T>;

  /**
   * Returns this result if this result is `Ok`.
   *
   * ```ts
   * let def = ok('default');
   * let result = ok('example');
   * let output = result.or(def);
   *
   * assert(output === result);
   * ```
   *
   * If this result is `Err`, then the default result is returned.
   *
   * ```ts
   * result = err(123);
   * output = result.or(def);
   *
   * assert(output === def);
   * ```
   *
   * If both this and the default result is `Err`, the default result is returned.
   *
   * ```ts
   * def = err(456);
   * result = err(123);
   * output = result.or(def);
   *
   * assert(output === def);
   * ```
   *
   * @param def The default result.
   *
   * @return This or the default result.
   */
  or<F>(def: Result<T, F>): Result<T, F>;

  /**
   * Returns this result if this result is `Ok`.
   *
   * ```ts
   * let def = () => ok('default');
   * let result = ok('example');
   * let output = result.or(def);
   *
   * assert(output === result);
   * ```
   *
   * If this result is `Err`, then the default result is computed and returned.
   *
   * ```ts
   * result = err(123);
   * output = result.or(def);
   *
   * assert(output === def);
   * ```
   *
   * @param def The default result computer.
   *
   * @return This or the default result.
   */
  orElse<F>(def: Compute<E, Result<T, F>>): Result<T, F>;

  /**
   * Returns the value in this result if this result is `Ok`.
   *
   * ```ts
   * let result = ok('example');
   * let output = result.unwrap();
   *
   * assert(output === 'example');
   * ```
   *
   * If this result is `Err`, an error is thrown.
   *
   * ```ts
   * result = err(123);
   * output = result.unwrap();
   *
   * // throws error
   * ```
   *
   * @return The value.
   *
   * @throws {ResultError} If this result is not `Ok`.
   */
  unwrap(): T;

  /**
   * Returns the value in this result if this result is `Err`.
   *
   * ```ts
   * let result = err(123);
   * let output = result.unwrapErr();
   *
   * assert(output === 123);
   * ```
   *
   * If this result is `Ok`, an error is thrown.
   *
   * ```ts
   * result = ok('example');
   * output = result.unwrapErr();
   *
   * // throws error
   * ```
   *
   * @return The value.
   *
   * @throws {ResultError} If this result is not `Err`.
   */
  unwrapErr(): E;

  /**
   * Returns the value in this result if this result is `Ok`.
   *
   * ```ts
   * let def = 'default';
   * let result = ok('example');
   * let output = result.unwrapOr(default);
   *
   * assert(output === 'example');
   * ```
   *
   * If this result is `Err`, then the default value is returned.
   *
   * ```ts
   * result = err(123);
   * output = result.unwrapOr(default);
   *
   * assert(output === def);
   * ```
   *
   * @param def The default value.
   *
   * @return The value in this result or the default value.
   */
  unwrapOr(def: T): T;

  /**
   * Returns the value in this result if this result is `Ok`.
   *
   * ```ts
   * let def = () => 'default';
   * let result = ok('example');
   * let output = result.unwrapOr(default);
   *
   * assert(output === 'example');
   * ```
   *
   * If this result is `Err`, then the default value is computed and returned.
   *
   * ```ts
   * result = err(123);
   * output = result.unwrapOr(default);
   *
   * assert(output === 'default');
   * ```
   *
   * @param def The default value computer.
   *
   * @return The value in this result or the default value.
   */
  unwrapOrElse(def: Compute<E, T>): T;
}

/**
 * Manages a value that represents failure.
 */
class Err<T, E> implements Result<T, E> {
  /**
   * Wraps the error value.
   *
   * @param value The value.
   */
  constructor(private value: E) {}

  and<U>(_: Result<U, E>): Result<U, E> {
    return new Err(this.value);
  }

  andThen<U>(_: Compute<T, Result<U, E>>): Result<U, E> {
    return new Err(this.value);
  }

  err(): Option<E> {
    return some(this.value);
  }

  expect(error: string): never {
    throw new ResultError(error);
  }

  expectErr(_: string): E {
    return this.value;
  }

  isErr(): boolean {
    return true;
  }

  isOk() {
    return false;
  }

  map<U>(_: Compute<T, U>): Result<U, E> {
    return new Err(this.value);
  }

  mapErr<F>(fn: Compute<E, F>): Result<T, F> {
    return new Err(fn(this.value));
  }

  mapOr<U>(def: U, _: Compute<T, U>): U {
    return def;
  }

  mapOrElse<U>(def: Compute<E, U>, _: Compute<T, U>): U {
    return def(this.value);
  }

  ok(): Option<T> {
    return none();
  }

  or<F>(def: Result<T, F>): Result<T, F> {
    return def;
  }

  orElse<F>(def: Compute<E, Result<T, F>>): Result<T, F> {
    return def(this.value);
  }

  unwrap(): never {
    let message: string;
    const type = typeof this.value;

    switch (type) {
      case 'function':
        message = '[Function]';
        break;

      case 'object':
        message = JSON.stringify(this.value);
        break;

      case 'symbol':
        message = '[Symbol]';
        break;

      default:
        message = (this.value as any) as string;
    }

    throw new ResultError(message);
  }

  unwrapErr(): E {
    return this.value;
  }

  unwrapOr(def: T): T {
    return def;
  }

  unwrapOrElse(def: Compute<E, T>): T {
    return def(this.value);
  }
}

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
 * Manages a value that represents success.
 */
class Ok<T, E> implements Result<T, E> {
  /**
   * Wraps the okay value.
   *
   * @param value The value.
   */
  constructor(private value: T) {}

  and<U>(other: Result<U, E>): Result<U, E> {
    return other;
  }

  andThen<U>(other: Compute<T, Result<U, E>>): Result<U, E> {
    return other(this.value);
  }

  err(): Option<E> {
    return none();
  }

  expect(_: string): T {
    return this.value;
  }

  expectErr(error: string): never {
    throw new ResultError(error);
  }

  isErr(): boolean {
    return false;
  }

  isOk() {
    return true;
  }

  map<U>(fn: Compute<T, U>): Result<U, E> {
    return new Ok(fn(this.value));
  }

  mapErr<F>(_: Compute<E, F>): Result<T, F> {
    return new Ok(this.value);
  }

  mapOr<U>(_: U, fn: Compute<T, U>): U {
    return fn(this.value);
  }

  mapOrElse<U>(_: Compute<E, U>, fn: Compute<T, U>): U {
    return fn(this.value);
  }

  ok(): Option<T> {
    return some(this.value);
  }

  or<F>(_: Result<T, F>): Result<T, F> {
    return new Ok(this.value);
  }

  orElse<F>(_: Compute<E, Result<T, F>>): Result<T, F> {
    return new Ok(this.value);
  }

  unwrap() {
    return this.value;
  }

  unwrapErr(): E {
    throw new ResultError('There is no Err value to unwrap.');
  }

  unwrapOr(_: T): T {
    return this.value;
  }

  unwrapOrElse(_: Compute<E, T>): T {
    return this.value;
  }
}

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

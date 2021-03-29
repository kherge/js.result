import type Result from "./Result";
import type { Compute } from "../types";
import type { Option } from '../option';

import ResultError from "./ResultError";
import { none, some } from "../option";

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

export default Ok;

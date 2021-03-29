import type Option from "./Option";
import type { Compute, Predicate, Produce } from "../types";
import type { Result } from "../result";

import OptionError from "./OptionError";
import Some from "./Some";
import { err } from "../result";

/**
 * Manages access to a value this is not present.
 */
class None<T> implements Option<T> {
  and<U>(_: Option<U>): Option<U> {
    return new None();
  }

  andThen<U>(_: Compute<T, Option<U>>): Option<U> {
    return new None();
  }

  expect(message: string): never {
    throw new OptionError(message);
  }

  filter(_: Predicate<T>): Option<T> {
    return new None();
  }

  getOrInsert(value: T): T {
    this.replace(value);

    return value;
  }

  getOrInsertWith(fn: Produce<T>): T {
    const value = fn();

    this.replace(value);

    return value;
  }

  isNone(): boolean {
    return true;
  }

  isSome(): boolean {
    return false;
  }

  map<U>(_: Compute<T, U>): Option<U> {
    return new None();
  }

  mapOr<U>(def: U, _: Compute<T, U>): U {
    return def;
  }

  mapOrElse<U>(def: Produce<U>, _: Compute<T, U>): U {
    return def();
  }

  okOr<E>(error: E): Result<T, E> {
    return err(error);
  }

  okOrElse<E>(error: Produce<E>): Result<T, E> {
    return err(error());
  }

  or(other: Option<T>): Option<T> {
    return other;
  }

  orElse(fn: Produce<Option<T>>): Option<T> {
    return fn();
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

  unwrapOrElse(fn: Produce<T>): T {
    return fn();
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

export default None;

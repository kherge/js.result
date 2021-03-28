import { Compute, Map, Predicate } from './shared';
import { Err, Ok, Result } from './result';

/**
 * An `Option` related error.
 */
class OptionError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, OptionError.prototype);
  }
}

/**
 * Manages access to a value that may be optionally present.
 */
export abstract class Option<T> {
  /**
   * Returns `None` if `None`, otherwise returns `other`.
   *
   * @param other The other option.
   *
   * @return The `None` option, or other option.
   */
  and<U>(other: Option<U>): Option<U> {
    if (this.isNone() || other.isNone()) {
      return new None();
    }

    return other;
  }

  /**
   * Returns `None` if `None`, otherwise maps the value.
   *
   * @param fn The option mapper.
   *
   * @returns The `None` option, or the mapped option.
   */
  andThen<U>(fn: Map<T, Option<U>>): Option<U> {
    if (this.isNone()) {
      return new None();
    }

    return fn(this.unwrap());
  }

  /**
   * Returns `Some<T>` if `Some` and predicate returns `true`.
   *
   * @param predicate The predicate to apply.
   *
   * @returns The `Some<T>` or `None<T>`.
   */
  filter(predicate: Predicate<T>): Option<T> {
    if (this.isSome() && predicate(this.unwrap())) {
      return new Some(this.unwrap());
    }

    return new None();
  }

  /**
   * Returns `true` if `None`.
   *
   * @return Returns `true` if `None`, or `false` if not.
   */
  isNone(): boolean {
    return !this.isSome();
  }

  /**
   * Returns `true` if `Some`.
   *
   * @return Returns `true` if `Some`, or `false` if not.
   */
  abstract isSome(): boolean;

  /**
   * Maps the value if present.
   *
   * @param fn The mapping function.
   *
   * @return The result.
   */
  map<U>(fn: Map<T, U>): Option<U> {
    if (this.isSome()) {
      return new Some(fn(this.unwrap()));
    }

    return new None();
  }

  /**
   * Maps the value if present, or returns the default.
   *
   * @param def The default value.
   * @param fn  The mapping function.
   *
   * @return The mapped or default value.
   */
  mapOr<U>(def: U, fn: Map<T, U>): U {
    if (this.isSome()) {
      return fn(this.unwrap());
    }

    return def;
  }

  /**
   * Maps the value if present, or computes the default.
   *
   * @param def The default value computer.
   * @param fn  The mapping function.
   *
   * @return The mapped or computed default value.
   */
  mapOrElse<U>(def: Compute<U>, fn: Map<T, U>): U {
    if (this.isSome()) {
      return fn(this.unwrap());
    }

    return def();
  }

  /**
   * Transforms `Option<T>` into `Result<T, E>`.
   *
   * @param error The possible error.
   *
   * @return The result.
   */
  okOr<E>(error: E): Result<T, E> {
    if (this.isSome()) {
      return new Ok(this.unwrap());
    }

    return new Err(error);
  }

  /**
   * Transforms `Option<T>` into `Result<T, E>` or computes `Error<T, E>`.
   *
   * @param error The possible error computer.
   *
   * @return The result.
   */
  okOrElse<E>(error: Compute<E>): Result<T, E> {
    if (this.isSome()) {
      return new Ok(this.unwrap());
    }

    return new Err(error());
  }

  /**
   * Returns `Some<T>` if `Some`, or returns `other`.
   *
   * @param other The other option.
   *
   * @returns The `Some` option, or other option.
   */
  or(other: Option<T>): Option<T> {
    if (this.isSome()) {
      return this;
    }

    return other;
  }

  /**
   * Returns `Some<T>` if `Some`, or computes other.
   *
   * @param other The other option computer.
   *
   * @returns The `Some` option, or other computed option.
   */
  orElse(other: Compute<Option<T>>): Option<T> {
    if (this.isSome()) {
      return this;
    }

    return other();
  }

  /**
   * Replaces the value in `Some` if `Some.
   *
   * @param value The replacement value.
   *
   * @return The old value.
   *
   * @throws {OptionError} If not `Some`.
   */
  abstract replace(value: T): Option<T>;

  /**
   * Unwraps the optional value.
   *
   * @return The value.
   *
   * @throws {OptionError} If no value is present.
   */
  abstract unwrap(): T;

  /**
   * Unwraps the value if present, or returns the default.
   *
   * @param def The default value.
   *
   * @return The unwrapped or default value.
   */
  unwrapOr(def: T): T {
    if (this.isSome()) {
      return this.unwrap();
    }

    return def;
  }

  /**
   * Unwraps the value if present, or computes the default.
   *
   * @param def The default value computer.
   *
   * @return The unwrapped or computed default value.
   */
  unwrapOrElse(def: Compute<T>) {
    if (this.isSome()) {
      return this.unwrap();
    }

    return def();
  }

  /**
   * Returns this or `other`, but `None` if both are `Some`.
   *
   * @param other The other option.
   *
   * @returns Something.
   */
  xor(other: Option<T>): Option<T> {
    if (this.isSome() && !other.isSome()) {
      return this;
    } else if (!this.isSome() && other.isSome()) {
      return other;
    }

    return new None();
  }

  /**
   * Zips `Some` with `other` if both are `Some`.
   *
   * @param other The other option.
   *
   * @returns The zipped option or `None`.
   */
  zip<U>(other: Option<U>): Option<[T, U]> {
    if (this.isSome() && other.isSome()) {
      return new Some([this.unwrap(), other.unwrap()]);
    }

    return new None();
  }
}

/**
 * Manages access to a value this is not present.
 */
export class None<T> extends Option<T> {
  isSome() {
    return false;
  }

  replace(_: T): never {
    throw new OptionError('Not a Some option.');
  }

  unwrap(): never {
    throw new OptionError('No value to unwrap.');
  }
}

/**
 * Manages access to a value that is present.
 */
export class Some<T> extends Option<T> {
  /**
   * Wraps the optional value.
   *
   * @param value The value.
   */
  constructor(private value: T) {
    super();
  }

  isSome() {
    return true;
  }

  replace(value: T) {
    const old = new Some(this.value);

    this.value = value;

    return old;
  }

  unwrap() {
    return this.value;
  }
}

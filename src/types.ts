/**
 * Computes a new value for the given value.
 */
export type Compute<T, U> = (value: T) => U;

/**
 * Produces a value.
 */
export type Produce<T> = () => T;

/**
 * Validates an assertion on a value.
 */
export type Predicate<T> = (value: T) => boolean;

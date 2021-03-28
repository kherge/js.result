/**
 * Computes a value of a specific type.
 */
export type Compute<T> = () => T;

/**
 * Maps a value of one type into another.
 */
export type Map<T, U> = (value: T) => U;

/**
 * Validates an assertion on a value.
 */
export type Predicate<T> = (value: T) => boolean;

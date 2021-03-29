import type Option from '../../src/option/Option';
import type { Compute, Predicate } from '../../src/types';
import type { Result } from '../../src/result';

import None from "../../src/option/None";
import Some from "../../src/option/Some";

describe('Some', () => {
  let option: Option<string>;

  beforeEach(() => {
    option = new Some('a');
  });

  describe('and()', () => {
    let other: Option<boolean>;
    let result: Option<boolean>;

    test('should always return the other option', () => {
      other = new Some(true);

      result = option.and(other);

      expect(result).toBe(other);
    });
  });

  describe('andThen()', () => {
    let fn: Compute<string, Option<boolean>>;
    let result: Option<boolean>;

    test('should always return the mapped option', () => {
      fn = v => new Some(v === 'a');
      result = option.andThen(fn);

      expect(result.isSome()).toBe(true);
      expect(result.unwrap()).toBe(true);
    });
  });

  describe('filter()', () => {
    let predicate: Predicate<string>;
    let result: Option<string>;

    test('should return Some if option is Some and match', () => {
      predicate = v => v === 'a';
      result = option.filter(predicate);

      expect(result.isSome()).toBe(true);
      expect(result.unwrap()).toEqual('a');
    });

    test('should return None if option is Some and does not match', () => {
      predicate = v => v === 'b';
      result = option.filter(predicate);

      expect(result.isNone()).toBe(true);
    });
  });

  describe('isNone()', () => {
    test('should always return false', () => {
      expect(option.isNone()).toBe(false);
    });
  });

  describe('isSome()', () => {
    test('should always return true', () => {
      expect(option.isSome()).toBe(true);
    });
  });

  describe('map()', () => {
    let fn: Compute<string, number>;
    let result: Option<number>;

    test('should always map the value', () => {
      fn = v => v.length;
      result = option.map(fn);

      expect(result.isSome()).toBe(true);
      expect(result.unwrap()).toEqual(1);
    });
  });

  describe('mapOr()', () => {
    const def = 123;
    let fn: Compute<string, number>;
    let result: number;

    test('should always map the value', () => {
      fn = v => v.length;
      result = option.mapOr(def, fn);

      expect(result).toEqual(1);
    });
  });

  describe('mapOrElse()', () => {
    const def = () => 123;
    let fn: Compute<string, number>;
    let result: number;

    test('should always map the value', () => {
      fn = v => v.length;
      result = option.mapOrElse(def, fn);

      expect(result).toEqual(1);
    });
  });

  describe('okOr()', () => {
    const error = 'test';
    let result: Result<string, string>;

    test('should always return Ok', () => {
      result = option.okOr(error);

      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toEqual('a');
    });
  });

  describe('okOrElse()', () => {
    const error = () => 'test';
    let result: Result<string, string>;

    test('should always return Ok', () => {
      result = option.okOrElse(error);

      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toEqual('a');
    });
  });

  describe('or()', () => {
    const other = new Some('b');
    let result: Option<string>;

    test('should always return self', () => {
      result = option.or(other);

      expect(result).toBe(option);
    });
  });

  describe('orElse()', () => {
    const other = () => new Some('b');
    let result: Option<string>;

    test('should always return self', () => {
      result = option.orElse(other);

      expect(result).toBe(option);
    });
  });

  describe('replace()', () => {
    test('should always replace the value', () => {
      const old: Option<string> = option.replace('b');

      expect(old.unwrap()).toBe('a');
      expect(option.unwrap()).toBe('b');
    });
  });

  describe('unwrap()', () => {
    test('should always return the value', () => {
      expect(option.unwrap()).toEqual('a');
    });
  });

  describe('unwrapOr()', () => {
    const def = 'b';
    let result: string;

    test('should always return the value', () => {
      result = option.unwrapOr(def);

      expect(result).toEqual('a');
    });
  });

  describe('unwrapOrElse()', () => {
    const def = () => 'b';
    let result: string;

    test('should always return the value', () => {
      result = option.unwrapOrElse(def);

      expect(result).toEqual('a');
    });
  });

  describe('xor()', () => {
    let other: Option<string>;
    let result: Option<string>;

    test('should always return this option if the other option is None', () => {
      other = new None();
      result = option.xor(other);

      expect(result).toBe(option);
    });

    test('should always return None if both are Some', () => {
      other = new Some('b');
      result = option.xor(other);

      expect(result.isNone()).toBe(true);
    });
  });

  describe('zip()', () => {
    let other: Option<string>;
    let result: Option<[string, string]>;

    test('should return zipped Some if both are Some', () => {
      other = new Some('b');
      result = option.zip(other);

      expect(result.isSome()).toBe(true);
      expect(result.unwrap()).toEqual(['a', 'b']);
    });

    test('should return None if other is None', () => {
      other = new None();
      result = option.zip(other);

      expect(result.isNone()).toBe(true);
    });
  });
});

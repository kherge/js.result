import type Option from "../../src/option/Option";
import type { Compute, Predicate, Produce } from '../../src/types';
import type { Result } from '../../src/result';

import None from "../../src/option/None";
import Some from "../../src/option/Some";

type TestType = {
  value: string;
};

describe('None', () => {
  let option: Option<TestType>;

  beforeEach(() => {
    option = new None();
  });

  describe('and()', () => {
    test('should always return None', () => {
      const other: Option<string> = new Some('other');
      const result: Option<string> = option.and(other);

      expect(result.isNone()).toBe(true);
      expect(result).not.toBe(option);
    });
  });

  describe('andThen()', () => {
    test('should always return None', () => {
      const fn: Compute<TestType, Option<TestType>> = jest.fn();
      const result: Option<TestType> = option.andThen(fn);

      expect(fn).not.toHaveBeenCalled();
      expect(result.isNone()).toBe(true);
      expect(result).not.toBe(option);
    });
  });

  describe('expect()', () => {
    test('should always throw an error', () => {
      const message: string = 'error';
      
      expect(() => option.expect(message)).toThrow(message);
    });
  });

  describe('filter()', () => {
    test('should always return itself', () => {
      const fn: Predicate<TestType> = jest.fn();
      const result: Option<TestType> = option.filter(fn);

      expect(fn).not.toHaveBeenCalled();
      expect(result.isNone()).toBe(true);
      expect(result).not.toBe(option);
    });
  });

  describe('getOrInsert()', () => {
    test('should always insert', () => {
      const value: TestType = {value: 'value'};
      const result: TestType = option.getOrInsert(value);

      expect(result).toBe(value);
      expect(option.isSome()).toBe(true);
      expect(option.unwrap()).toBe(value);
    });
  });

  describe('getOrInsertWith()', () => {
    test('should always insert', () => {
      const value: TestType = {value: 'value'};
      const fn: Produce<TestType> = jest.fn(() => value);
      const result: TestType = option.getOrInsertWith(fn);

      expect(fn).toHaveBeenCalled();
      expect(result).toBe(value);
      expect(option.isSome()).toBe(true);
      expect(option.unwrap()).toBe(value);
    });
  });

  describe('isNone()', () => {
    test('should always return true', () => {
      expect(option.isNone()).toBe(true);
    });
  });

  describe('isSome()', () => {
    test('should always return false', () => {
      expect(option.isSome()).toBe(false);
    });
  });

  describe('map()', () => {
    test('should always return None', () => {
      const fn: Compute<TestType, number> = jest.fn();
      const result: Option<number> = option.map(fn);

      expect(fn).not.toHaveBeenCalled();
      expect(result.isNone()).toBe(true);
      expect(result).not.toBe(option);
    });
  });

  describe('mapOr()', () => {
    test('should always return the default value', () => {
      const def: number = 123;
      const fn: Compute<TestType, number> = jest.fn();
      const result: number = option.mapOr(def, fn);

      expect(fn).not.toHaveBeenCalled();
      expect(result).toEqual(def);
    });
  });

  describe('mapOrElse()', () => {
    test('should always return the default value', () => {
      const value: number = 123;
      const def: Produce<number> = jest.fn(() => value);
      const fn: Compute<TestType, number> = jest.fn();
      const result: number = option.mapOrElse(def, fn);

      expect(def).toHaveBeenCalled();
      expect(fn).not.toHaveBeenCalled();
      expect(result).toEqual(value);
    });
  });

  describe('okOr()', () => {
    test('should always return Err', () => {
      const error: string = 'error';
      const result: Result<TestType, string> = option.okOr(error);

      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBe(error);
    });
  });

  describe('okOrElse()', () => {
    test('should always return Err', () => {
      const error: string = 'error';
      const fn: Produce<string> = jest.fn(() => 'error');
      const result: Result<TestType, string> = option.okOrElse(fn);

      expect(fn).toHaveBeenCalled();
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBe(error);
    });
  });

  describe('or()', () => {
    test('should always return the other option', () => {
      const other: Option<TestType> = new Some({ value: 'value'});
      const result: Option<TestType> = option.or(other);

      expect(result).toBe(other);
    });
  });

  describe('orElse()', () => {
    test('should always return the other option', () => {
      const other: Option<TestType> = new Some({value: 'value'});
      const fn: Produce<Option<TestType>> = jest.fn(() => other);
      const result: Option<TestType> = option.orElse(fn);

      expect(fn).toHaveBeenCalled();
      expect(result).toBe(other);
    });
  });

  describe('replace()', () => {
    test('should replace the value and return None', () => {
      const value: TestType = {value: 'value'};
      const result: Option<TestType> = option.replace(value);

      expect(result.isNone()).toBe(true);
      expect(result).not.toBe(option);
      expect(option.isSome()).toBe(true);
      expect(option.unwrap()).toBe(value);
    });
  });

  describe('unwrap()', () => {
    test('should always throw an error', () => {
      expect(() => option.unwrap()).toThrow('No value to unwrap.');
    });
  });

  describe('unwrapOr()', () => {
    test('should always return the default value', () => {
      const def: TestType = {value: 'value'};
      const result: TestType = option.unwrapOr(def);
  
      expect(result).toBe(def);
    });
  });

  describe('unwrapOrElse()', () => {
    test('should always return the default value', () => {
      const def: TestType = {value: 'value'};
      const fn: Produce<TestType> = jest.fn(() => def);
      const result: TestType = option.unwrapOrElse(fn);
  
      expect(fn).toHaveBeenCalled();
      expect(result).toBe(def);
    });
  });

  describe('xor', () => {
    let other: Option<TestType>;
    let result: Option<TestType>;

    test('should return the other option if it is Some', () => {
      other = new Some({value: 'value'});
      result = option.xor(other);

      expect(result).toBe(other);
    });

    test('should return None if the other option is None', () => {
      other = new None<TestType>();
      result = option.xor(other);

      expect(result.isNone()).toBe(true);
      expect(result).not.toBe(option);
      expect(result).not.toBe(other);
    });
  });

  describe('zip()', () => {
    test('should always return None', () => {
      const other: Option<string> = new Some('other');
      const result: Option<[TestType, string]> = option.zip(other);

      expect(result.isNone());
      expect(result).not.toBe(option);
    });
  });
});
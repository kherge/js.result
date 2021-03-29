import type Option from '../../src/option/Option';
import type { Compute, Predicate, Produce } from '../../src/types';
import type { Result } from '../../src/result';

import None from "../../src/option/None";
import Some from "../../src/option/Some";

type TestType = {
  value: string;
};

describe('Some', () => {
  let option: Option<TestType>;
  const value: TestType = {value: 'value'};

  beforeEach(() => {
    option = new Some(value);
  });

  describe('and()', () => {
    test('should always return the other option', () => {
      const other: Option<number> = new Some(123);
      const result: Option<number> = option.and(other);

      expect(result).toBe(other);
    });
  });

  describe('andThen()', () => {
    test('should always return the other option', () => {
      const other: Option<number> = new Some(123);
      const fn: Compute<TestType, Option<number>> = jest.fn(() => other);
      const result: Option<number> = option.andThen(fn);

      expect(fn).toHaveBeenCalledWith(value);
      expect(result).toBe(other);
    });
  });

  describe('expect()', () => {
    test('should always return the value', () => {
      const message: string = 'error';
      const result: TestType = option.expect(message);

      expect(result).toBe(value);
    });
  });

  describe('filter()', () => {
    let fn: Predicate<TestType>;
    let result: Option<TestType>;

    test('should return itself if the predicate matches', () => {
      fn = jest.fn(v => v === value);
      result = option.filter(fn);

      expect(fn).toHaveBeenCalledWith(value);
      expect(result).toBe(option);
    });

    test('should return None if the predicate does not match', () => {
      fn = jest.fn(() => false);
      result = option.filter(fn);

      expect(fn).toHaveBeenCalledWith(value);
      expect(result.isNone()).toBe(true);
    });
  });

  describe('getOrInsert()', () => {
    test('should always return the value in the option', () => {
      const insert: TestType = {value: 'insert'};
      const result: TestType = option.getOrInsert(insert);

      expect(result).toBe(value);
    });
  });

  describe('getOrInsertWith()', () => {
    test('should always return the value in the option', () => {
      const fn: Produce<TestType> = jest.fn();
      const result: TestType = option.getOrInsertWith(fn);

      expect(fn).not.toHaveBeenCalled();
      expect(result).toBe(value);
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
    test('should always map the value', () => {
      const fn: Compute<TestType, number> = jest.fn(v => v.value.length);
      const result: Option<number> = option.map(fn);

      expect(fn).toHaveBeenCalledWith(value);
      expect(result.isSome()).toBe(true);
      expect(result.unwrap()).toBe(value.value.length);
    });
  });

  describe('mapOr()', () => {
    test('should always map the value', () => {
      const def: number = 123;
      const fn: Compute<TestType, number> = jest.fn(v => v.value.length);
      const result: number = option.mapOr(def, fn);

      expect(fn).toHaveBeenCalledWith(value);
      expect(result).toBe(value.value.length);
    });
  });

  describe('mapOrElse()', () => {
    test('should always map the value', () => {
      const def: Produce<number> = jest.fn();
      const fn: Compute<TestType, number> = jest.fn(v => v.value.length);
      const result: number = option.mapOrElse(def, fn);

      expect(def).not.toHaveBeenCalled();
      expect(fn).toHaveBeenCalledWith(value);
      expect(result).toBe(value.value.length);
    });
  });

  describe('okOr()', () => {
    test('should always return Ok', () => {
      const error: string = 'error';
      const result: Result<TestType, string> = option.okOr(error);

      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe(value);
    });
  });

  describe('okOrElse()', () => {
    test('should always return Ok', () => {
      const fn: Produce<string> = jest.fn();
      const result: Result<TestType, string> = option.okOrElse(fn);

      expect(fn).not.toHaveBeenCalled();
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe(value);
    });
  });

  describe('or()', () => {
    test('should always return itself', () => {
      const other: Option<TestType> = new Some({value: 'other'});
      const result: Option<TestType> = option.or(other);

      expect(result).toBe(option);
    });
  });

  describe('orElse()', () => {
    test('should always return itself', () => {
      const fn: Produce<Option<TestType>> = jest.fn();
      const result: Option<TestType> = option.orElse(fn);

      expect(fn).not.toHaveBeenCalled();
      expect(result).toBe(option);
    });
  });

  describe('replace()', () => {
    test('should replace the value and return the old one', () => {
      const newValue: TestType = {value: 'newValue'};
      const result: Option<TestType> = option.replace(newValue);

      expect(result.isSome()).toBe(true);
      expect(result.unwrap()).toBe(value);
      expect(option.unwrap()).toBe(newValue);
    });
  });

  describe('unwrap()', () => {
    test('should always return the value', () => {
      expect(option.unwrap()).toBe(value);
    });
  });

  describe('unwrapOr()', () => {
    test('should always return the value', () => {
      const def: TestType = {value: 'default'};

      expect(option.unwrapOr(def)).toBe(value);
    });
  });

  describe('unwrapOrElse()', () => {
    test('should always return the value', () => {
      const fn: Produce<TestType> = jest.fn();
      
      expect(fn).not.toHaveBeenCalled();
      expect(option.unwrapOrElse(fn)).toBe(value);
    });
  });

  describe('xor()', () => {
    let other: Option<TestType>;
    let result: Option<TestType>;

    test('should return the other option if it is Some and this option is None', () => {
      option = new None();
      other = new Some({ value: 'other' });
      result = option.xor(other);

      expect(result).toBe(other);
    });

    test('should return itself if it is Some and the other option is None', () => {
      other = new None();
      result = option.xor(other);

      expect(result).toBe(option);
    });

    test('should return None if both options are Some', () => {
      other = new Some({ value: 'other' });
      result = option.xor(other);

      expect(result.isNone()).toBe(true);
    });

    test('should return None if both options are None', () => {
      option = new None();
      other = new None();
      result = option.xor(other);

      expect(result.isNone()).toBe(true);
      expect(result).not.toBe(option);
      expect(result).not.toBe(other);
    });
  });

  describe('zip()', () => {
    let other: Option<TestType>;
    let result: Option<[TestType, TestType]>;

    test('should zip the values if both options are Some', () => {
      const otherValue: TestType = { value: 'other' };
      other = new Some(otherValue);
      result = option.zip(other);

      expect(result.isSome()).toBe(true);
      expect(Array.isArray(result.unwrap())).toBe(true);
      expect(result.unwrap()[0]).toBe(value);
      expect(result.unwrap()[1]).toBe(otherValue);
    });

    test('should return None if the other option is None', () => {
      other = new None();
      result = option.zip(other);

      expect(result.isNone()).toBe(true);
      expect(result).not.toBe(other);
    });
  });
});

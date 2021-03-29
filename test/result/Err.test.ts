import type Result from '../../src/result/Result';
import type { Compute } from '../../src/types';
import type { Option } from '../../src/option';

import Err from '../../src/result/Err';
import Ok from '../../src/result/Ok';

type TestError = {
  error: string;
};

type TestOther = {
  other: string;
};

type TestValue = {
  value: string;
};

describe('Err', () => {
  let result: Result<TestValue, TestError>;
  const value: TestError = { error: 'error' };

  beforeEach(() => {
    result = new Err(value);
  });

  describe('and()', () => {
    test('always return Err', () => {
      const other: Result<TestOther, TestError> = new Ok({ other: 'other' });
      const output: Result<TestOther, TestError> = result.and(other);

      expect(output.isErr()).toBe(true);
      expect(output).not.toBe(result);
      expect(output).toStrictEqual(result);
    });
  });

  describe('andThen()', () => {
    test('always return Err', () => {
      const fn: Compute<TestValue, Result<TestOther, TestError>> = jest.fn();
      const output = result.andThen(fn);

      expect(fn).not.toHaveBeenCalledWith();
      expect(output.isErr()).toBe(true);
      expect(output).not.toBe(result);
      expect(output).toStrictEqual(result);
    });
  });

  describe('err()', () => {
    test('should always return Some', () => {
      const output: Option<TestError> = result.err();

      expect(output.isSome()).toBe(true);
      expect(output.unwrap()).toBe(value);
    });
  });

  describe('expect()', () => {
    test('should always throw error', () => {
      const message: string = 'error';
      
      expect(() => result.expect(message)).toThrow(message);
    });
  });

  describe('expectErr()', () => {
    test('should always return the value', () => {
      const message: string = 'error';
      const output: TestError = result.expectErr(message);

      expect(output).toBe(value);
    });
  });

  describe('isErr()', () => {
    test('should always return true', () => {
      expect(result.isErr()).toBe(true);
    });
  });

  describe('isOk()', () => {
    test('should always return false', () => {
      expect(result.isOk()).toBe(false);
    });
  });

  describe('map()', () => {
    test('should always return Err', () => {
      const fn: Compute<TestValue, TestOther> = jest.fn();
      const output: Result<TestOther, TestError> = result.map(fn);

      expect(fn).not.toHaveBeenCalled();
      expect(output.isErr()).toBe(true);
      expect(output).not.toBe(result);
      expect(output).toStrictEqual(result);
    });
  });

  describe('mapErr()', () => {
    test('should always map the value', () => {
      const other: TestOther = {other: 'other'};
      const fn: Compute<TestError, TestOther> = jest.fn(() => other);
      const output: Result<TestValue, TestOther> = result.mapErr(fn);

      expect(fn).toHaveBeenCalledWith(value);
      expect(output.isErr()).toBe(true);
      expect(output).not.toBe(result);
      expect(output.unwrapErr()).toBe(other);
    });
  });

  describe('mapOr()', () => {
    test('should always return the default value', () => {
      const def: TestOther = { other: 'other' };
      const fn: Compute<TestValue, TestOther> = jest.fn();
      const output: TestOther = result.mapOr(def, fn);

      expect(fn).not.toHaveBeenCalled();
      expect(output).toBe(def);
    });
  });

  describe('mapOrElse()', () => {
    test('should always return the default value', () => {
      const other: TestOther = { other: 'other' };
      const def: Compute<TestError, TestOther> = jest.fn(() => other);
      const fn: Compute<TestValue, TestOther> = jest.fn();
      const output: TestOther = result.mapOrElse(def, fn);

      expect(def).toHaveBeenCalledWith(value);
      expect(fn).not.toHaveBeenCalled();
      expect(output).toBe(other);
    });
  });

  describe('ok()', () => {
    test('should always return None', () => {
      const output: Option<TestValue> = result.ok();

      expect(output.isNone());
    });
  });

  describe('or()', () => {
    test('should always return the default value', () => {
      let other: Result<TestValue, TestOther>;
      let output: Result<TestValue, TestOther>;
      
      other = new Ok({value: 'other'});
      output = result.or(other);

      expect(output).toBe(other);

      other = new Err({other: 'error'});
      output = result.or(other);

      expect(output).toBe(other);
    });
  });

  describe('orElse()', () => {
    test('should always return the default value', () => {
      let other: Result<TestValue, TestOther> = new Ok({value: 'other'});
      let fn: Compute<TestError, Result<TestValue, TestOther>> = jest.fn(() => other);
      let output: Result<TestValue, TestOther> = result.orElse(fn);

      expect(fn).toHaveBeenCalledWith(value);
      expect(output).toBe(other);
    });
  });

  describe('unwrap()', () => {
    test('should always throw an error (function)', () => {
      const error = () => 'error';
      const result: Result<string, typeof error> = new Err(error);

      expect(() => result.unwrap()).toThrow('[Function]');
    });

    test('should always throw an error (object)', () => {
      expect(() => result.unwrap()).toThrow(JSON.stringify(value));
    });

    test('should always throw an error (scalar)', () => {
      const error: string = 'error';
      const result: Result<string, string> = new Err(error);

      expect(() => result.unwrap()).toThrow(error);
    });
    
    test('should always throw an error (symbol)', () => {
      const error = Symbol('symbol');
      const result: Result<string, typeof error> = new Err(error);

      expect(() => result.unwrap()).toThrow('[Symbol]');
    });
  });

  describe('unwrapErr()', () => {
    test('should always return the value', () => {
      expect(result.unwrapErr()).toBe(value);
    });
  });

  describe('unwrapOr()', () => {
    test('should always return the default value', () => {
      const def: TestValue = {value: 'value'};
      const output: TestValue = result.unwrapOr(def);

      expect(output).toBe(def);
    });
  });

  describe('unwrapOrElse()', () => {
    test('should always return the default value', () => {
      const def: TestValue = {value: 'value'};
      const fn: Compute<TestError, TestValue> = jest.fn(() => def);
      const output: TestValue = result.unwrapOrElse(fn);

      expect(fn).toHaveBeenCalledWith(value);
      expect(output).toBe(def);
    });
  });
});

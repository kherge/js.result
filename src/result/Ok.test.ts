import type Result from '../../src/result/Result';
import type { Compute } from '../../src/types';
import type { Option } from '../../src/option';

// import Err from '../../src/result/Err';
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

describe('Ok', () => {
  let result: Result<TestValue, TestError>;
  const value: TestValue = { value: 'value' };

  beforeEach(() => {
    result = new Ok(value);
  });

  describe('and()', () => {
    test('should always return the other result', () => {
      const other: Result<TestOther, TestError> = new Ok({ other: 'other' });
      const output: Result<TestOther, TestError> = result.and(other);

      expect(output).toBe(other);
    });
  });

  describe('andThen()', () => {
    test('should always map the value', () => {
      const other: Result<TestOther, TestError> = new Ok({ other: 'other' });
      const fn: Compute<TestValue, Result<TestOther, TestError>> = jest.fn(() => other);
      const output: Result<TestOther, TestError> = result.andThen(fn);

      expect(fn).toHaveBeenCalledWith(value);
      expect(output).toBe(other);
    });
  });

  describe('err()', () => {
    test('should always return None', () => {
      const output: Option<TestError> = result.err();

      expect(output.isNone());
    });
  });

  describe('expect()', () => {
    test('should always return the value', () => {
      const message: string = 'error';

      expect(result.expect(message)).toBe(value);
    });
  });

  describe('expectErr()', () => {
    test('should always throw an error', () => {
      const message: string = 'error';

      expect(() => result.expectErr(message)).toThrow(message);
    });
  });

  describe('isErr()', () => {
    test('should always return false', () => {
      expect(result.isErr()).toBe(false);
    });
  });

  describe('isOk()', () => {
    test('should always return true', () => {
      expect(result.isOk()).toBe(true);
    });
  });

  describe('map()', () => {
    test('should always map the value', () => {
      const other: TestOther = { other: 'other' };
      const fn: Compute<TestValue, TestOther> = jest.fn(() => other);
      const output: Result<TestOther, TestError> = result.map(fn);

      expect(fn).toHaveBeenCalledWith(value);
      expect(output.isOk()).toBe(true);
      expect(output.unwrap()).toBe(other);
    });
  });

  describe('mapErr()', () => {
    test('should always return itself as a new, properly typed Ok', () => {
      const fn: Compute<TestError, TestOther> = jest.fn();
      const output: Result<TestValue, TestOther> = result.mapErr(fn);

      expect(fn).not.toHaveBeenCalled();
      expect(output.isOk()).toBe(true);
      expect(output.unwrap()).toBe(value);
      expect(output).not.toBe(result);
    });
  });

  describe('mapOr()', () => {
    test('should always return the mapped value', () => {
      const def: TestOther = { other: 'default' };
      const other: TestOther = { other: 'other' };
      const fn: Compute<TestValue, TestOther> = jest.fn(() => other);
      const output: TestOther = result.mapOr(def, fn);

      expect(fn).toHaveBeenCalledWith(value);
      expect(output).toBe(other);
    });
  });

  describe('mapOrElse()', () => {
    test('should always return the mapped value', () => {
      const def: Compute<TestError, TestOther> = jest.fn();
      const other: TestOther = { other: 'other' };
      const fn: Compute<TestValue, TestOther> = jest.fn(() => other);
      const output: TestOther = result.mapOrElse(def, fn);

      expect(def).not.toHaveBeenCalled();
      expect(fn).toHaveBeenCalledWith(value);
      expect(output).toBe(other);
    });
  });

  describe('ok()', () => {
    test('should always return Ok', () => {
      const output: Option<TestValue> = result.ok();

      expect(output.isSome()).toBe(true);
      expect(output.unwrap()).toBe(value);
    });
  });

  describe('or()', () => {
    test('should always return itself, cast to the appropriate type', () => {
      const other: Result<TestValue, TestOther> = new Ok({ value: 'other' });
      const output: Result<TestValue, TestOther> = result.or(other);

      expect(output).toBe(result);
    });
  });

  describe('orElse()', () => {
    test('should always return itself, cast to the appropriate type', () => {
      const other: Result<TestValue, TestOther> = new Ok({ value: 'other' });
      const fn: Compute<TestError, Result<TestValue, TestOther>> = jest.fn(() => other);
      const output: Result<TestValue, TestOther> = result.orElse(fn);

      expect(fn).not.toHaveBeenCalled();
      expect(output).toBe(result);
    });
  });

  describe('unwrap()', () => {
    test('should always return the value', () => {
      expect(result.unwrap()).toBe(value);
    });
  });

  describe('unwrapErr()', () => {
    test('should always throw an error', () => {
      expect(() => result.unwrapErr()).toThrow('There is no Err value to unwrap.');
    });
  });

  describe('unwrapOr()', () => {
    test('should always return the value', () => {
      const def: TestValue = { value: 'default' };
      const output: TestValue = result.unwrapOr(def);

      expect(output).toBe(value);
    });
  });

  describe('unwrapOrElse()', () => {
    test('should always return the value', () => {
      const fn: Compute<TestError, TestValue> = jest.fn();
      const output: TestValue = result.unwrapOrElse(fn);

      expect(fn).not.toHaveBeenCalled();
      expect(output).toBe(value);
    });
  });
});

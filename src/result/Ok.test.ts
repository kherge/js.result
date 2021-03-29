import type Result from '../../src/result/Result';
import type { Compute } from '../../src/types';
import type { Option } from '../../src/option';

import Err from '../../src/result/Err';
import Ok from '../../src/result/Ok';

describe('Ok', () => {
  let result: Result<string, number>;

  beforeEach(() => {
    result = new Ok('test');
  });

  describe('and()', () => {
    let other: Result<boolean, number>;
    let output: Result<boolean, number>;

    test('should always return the other result', () => {
      other = new Ok(true);
      output = result.and(other);

      expect(output).toBe(other);

      other = new Err(123);
      output = result.and(other);

      expect(output).toBe(other);
    });
  });

  describe('andThen()', () => {
    let other: Compute<string, Result<boolean, number>>;
    let output: Result<boolean, number>;

    test('should always return the other computed result', () => {
      other = r => new Ok(r.length === 4);
      output = result.andThen(other);

      expect(output.isOk()).toBe(true);
      expect(output.unwrap()).toBe(true);
    });
  });

  describe('new Err()', () => {
    let output: Option<number>;

    test('should always return None', () => {
      output = result.err();

      expect(output.isNone()).toBe(true);
    });
  });

  describe('expect()', () => {
    const error = 'error';

    test('should always return the value', () => {
      expect(result.expect(error)).toEqual('test');
    });
  });

  describe('expectErr()', () => {
    const error = 'error';

    test('should always throw error', () => {
      expect(() => result.expectErr(error)).toThrow(error);
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
    const fn: Compute<string, boolean> = r => r.length === 4;
    let output: Result<boolean, number>;

    test('should always return self', () => {
      output = result.map(fn);

      expect(output.isOk()).toBe(true);
      expect(output.unwrap()).toEqual(true);
    });
  });

  describe('mapErr()', () => {
    const fn: Compute<number, boolean> = r => r === 123;
    let output: Result<string, boolean>;

    test('should always return self', () => {
      output = result.mapErr(fn);

      expect(output.isOk()).toBe(true);
      expect(output.unwrap()).toStrictEqual('test');
    });
  });

  describe('mapOr()', () => {
    const def = false;
    const fn: Compute<string, boolean> = r => r.length === 4;
    let output: boolean;

    test('should always return mapped value', () => {
      output = result.mapOr(def, fn);

      expect(output).toBe(true);
    });
  });

  describe('mapOrElse()', () => {
    const def: Compute<number, boolean> = r => r === 123;
    const fn: Compute<string, boolean> = r => r.length === 4;
    let output: boolean;

    test('should always return the mapped value', () => {
      output = result.mapOrElse(def, fn);

      expect(output).toBe(true);
    });
  });

  describe('new Ok()', () => {
    let output: Option<string>;

    test('should always return Some', () => {
      output = result.ok();

      expect(output.isSome());
      expect(output.unwrap()).toEqual('test');
    });
  });

  describe('or()', () => {
    let other: Result<string, boolean>;
    let output: Result<string, boolean>;

    test('should always return self', () => {
      other = new Ok('other');
      output = result.or(other);

      expect(output.isOk()).toBe(true);
      expect(output).toStrictEqual(result);
    });
  });

  describe('orElse()', () => {
    let other: Compute<number, Result<string, boolean>>;
    let output: Result<string, boolean>;

    test('should always return self', () => {
      other = () => new Ok('other');
      output = result.orElse(other);

      expect(output.isOk()).toBe(true);
      expect(output.unwrap()).toEqual('test');
    });
  });

  describe('unwrap()', () => {
    test('should always return the value', () => {
      expect(result.unwrap()).toEqual('test');
    });
  });

  describe('unwrapErr()', () => {
    test('should always throw an error', () => {
      expect(() => result.unwrapErr()).toThrow(
        'There is no Err value to unwrap.'
      );
    });
  });

  describe('unwrapOr()', () => {
    const def = 'default';

    test('should always return the value', () => {
      expect(result.unwrapOr(def)).toEqual('test');
    });
  });

  describe('unwrapOrElse()', () => {
    const def = () => 'default';

    test('should always return the value', () => {
      expect(result.unwrapOrElse(def)).toEqual('test');
    });
  });
});

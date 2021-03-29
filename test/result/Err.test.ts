import type Result from '../../src/result/Result';
import type { Compute } from '../../src/types';
import type { Option } from '../../src/option';

import Err from '../../src/result/Err';
import Ok from '../../src/result/Ok';

describe('Err', () => {
  let result: Result<string, number>;

  beforeEach(() => {
    result = new Err(123);
  });

  describe('and()', () => {
    let other: Result<boolean, number>;
    let output: Result<boolean, number>;

    test('should always return self', () => {
      other = new Ok(true);
      output = result.and(other);

      expect(output).not.toBe(result);
      expect(output).toStrictEqual(result);
    });
  });

  describe('andThen()', () => {
    let other: Compute<string, Result<boolean, number>>;
    let output: Result<boolean, number>;

    test('should always return self', () => {
      other = _ => new Ok(true);
      output = result.andThen(other);

      expect(output).toStrictEqual(result);
    });
  });

  describe('new Err()', () => {
    let output: Option<number>;

    test('should always return Some', () => {
      output = result.err();

      expect(output.isSome()).toBe(true);
      expect(output.unwrap()).toEqual(123);
    });
  });

  describe('expect()', () => {
    const error = 'error';

    test('should always throw error', () => {
      expect(() => result.expect(error)).toThrow(error);
    });
  });

  describe('expectErr()', () => {
    const error = 'error';

    test('should always return the value', () => {
      expect(result.expectErr(error)).toEqual(123);
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
    const fn: Compute<string, boolean> = r => r.length === 4;
    let output: Result<boolean, number>;

    test('should always return self', () => {
      output = result.map(fn);

      expect(output.isErr()).toBe(true);
      expect(output).toStrictEqual(result);
    });
  });

  describe('mapErr()', () => {
    const fn: Compute<number, boolean> = r => r === 123;
    let output: Result<string, boolean>;

    test('should always return mapped value', () => {
      output = result.mapErr(fn);

      expect(output.isErr()).toBe(true);
      expect(output.unwrapErr()).toEqual(true);
    });
  });

  describe('mapOr()', () => {
    const def = false;
    const fn: Compute<string, boolean> = r => r.length === 4;
    let output: boolean;

    test('should always return default value', () => {
      output = result.mapOr(def, fn);

      expect(output).toBe(false);
    });
  });

  describe('mapOrElse()', () => {
    const def: Compute<number, boolean> = r => r === 123;
    const fn: Compute<string, boolean> = r => r.length === 4;
    let output: boolean;

    test('should always return the mapped default value', () => {
      output = result.mapOrElse(def, fn);

      expect(output).toBe(true);
    });
  });

  describe('new Ok()', () => {
    let output: Option<string>;

    test('should always return None', () => {
      output = result.ok();

      expect(output.isNone());
    });
  });

  describe('or()', () => {
    let other: Result<string, boolean>;
    let output: Result<string, boolean>;

    test('should always return the other result', () => {
      other = new Ok('other');
      output = result.or(other);

      expect(output).toBe(other);
    });
  });

  describe('orElse()', () => {
    let other: Compute<number, Result<string, boolean>>;
    let output: Result<string, boolean>;

    test('should always compute and return the other result', () => {
      other = () => new Ok('other');
      output = result.orElse(other);

      expect(output.isOk()).toBe(true);
      expect(output.unwrap()).toEqual('other');
    });
  });

  describe('unwrap()', () => {
    test('should always throw an error', () => {
      expect(() => result.unwrap()).toThrow('123');
    });

    test('should always throw an error (handling function)', () => {
      const result = new Err(() => {});

      expect(() => result.unwrap()).toThrow('[Function]');
    });

    test('should always throw an error (handling object)', () => {
      const result = new Err({ test: 123 });

      expect(() => result.unwrap()).toThrow('{"test":123}');
    });

    test('should always throw an error (handling symbol)', () => {
      const result = new Err(Symbol('test'));

      expect(() => result.unwrap()).toThrow('[Symbol]');
    });
  });

  describe('unwrapErr()', () => {
    test('should always return the value', () => {
      expect(result.unwrapErr()).toEqual(123);
    });
  });

  describe('unwrapOr()', () => {
    const def = 'default';

    test('should always return the default value', () => {
      const output = result.unwrapOr(def);

      expect(output).toBe(def);
    });
  });

  describe('unwrapOrElse()', () => {
    const def = () => 'default';

    test('should always compute and return the default value', () => {
      const output = result.unwrapOrElse(def);

      expect(output).toEqual('default');
    });
  });
});

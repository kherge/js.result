import { Compute, Predicate } from '../src/shared';
import { Option, none, some } from '../src/option';
import { Result } from '../src/result';

describe('None', () => {
  let option: Option<string>;

  beforeEach(() => {
    option = none();
  });

  describe('and()', () => {
    let other: Option<boolean>;
    let result: Option<boolean>;

    test('should always return', () => {
      other = some(true);
      result = option.and(other);

      expect(result.isNone()).toBe(true);
    });
  });

  describe('andThen()', () => {
    let fn: Compute<string, Option<boolean>>;
    let result: Option<boolean>;

    test('should never invoke the mapper and always return None', () => {
      fn = jest.fn();
      result = option.andThen(fn);

      expect(result.isNone()).toBe(true);
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe('filter()', () => {
    let predicate: Predicate<string>;
    let result: Option<string>;

    test('should never invoke the predicate and always return None', () => {
      predicate = jest.fn();
      result = option.filter(predicate);

      expect(result.isNone()).toBe(true);
      expect(predicate).not.toHaveBeenCalled();
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
    let fn: Compute<string, number>;
    let result: Option<number>;

    test('should never invoke the mapper and always return None', () => {
      fn = jest.fn();
      result = option.map(fn);

      expect(result.isNone()).toBe(true);
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe('mapOr()', () => {
    const def = 123;
    let fn: Compute<string, number>;
    let result: number;

    test('should never invoke the mapper and always return the default value', () => {
      fn = jest.fn();
      result = option.mapOr(def, fn);

      expect(result).toEqual(def);
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe('mapOrElse()', () => {
    const def = () => 123;
    let fn: Compute<string, number>;
    let result: number;

    test('should never invoke the mapper and return the computed default value', () => {
      fn = jest.fn();
      result = option.mapOrElse(def, fn);

      expect(result).toEqual(123);
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe('okOr()', () => {
    const error = 'test';
    let result: Result<string, string>;

    test('should always return Err', () => {
      result = option.okOr(error);

      expect(result.isErr()).toBe(true);
      expect(result.err().isSome()).toBe(true);
      expect(result.err().unwrap()).toEqual(error);
    });
  });

  describe('okOrElse()', () => {
    const error = () => 'test';
    let result: Result<string, string>;

    test('should always compute the error value and return Err', () => {
      result = option.okOrElse(error);

      expect(result.isErr()).toBe(true);
      expect(result.err().isSome()).toBe(true);
      expect(result.err().unwrap()).toEqual(error());
    });
  });

  describe('or()', () => {
    const other = some('b');
    let result: Option<string>;

    test('should always return the other option', () => {
      result = option.or(other);

      expect(result).toBe(other);
    });
  });

  describe('orElse()', () => {
    const other = () => some('b');
    let result: Option<string>;

    test('should always return the computed other option', () => {
      result = option.orElse(other);

      expect(result.isSome()).toBe(true);
      expect(result.unwrap()).toEqual('b');
    });
  });

  describe('replace()', () => {
    test('should convert the option to Some and return None', () => {
      const old: Option<string> = option.replace('b');

      expect(old.isNone()).toBe(true);
      expect(option.isSome()).toBe(true);
      expect(option.unwrap()).toEqual('b');
    });
  });

  describe('unwrap()', () => {
    test('should always throw', () => {
      expect(() => option.unwrap()).toThrow('No value to unwrap.');
    });
  });

  describe('unwrapOr()', () => {
    const def = 'b';
    let result: string;

    test('should always return default value', () => {
      result = option.unwrapOr(def);

      expect(result).toEqual(def);
    });
  });

  describe('unwrapOrElse()', () => {
    const def = () => 'b';
    let result: string;

    test('should always return the computed default value', () => {
      result = option.unwrapOrElse(def);

      expect(result).toEqual(def());
    });
  });

  describe('xor()', () => {
    let other: Option<string>;
    let result: Option<string>;

    test('should return the other option', () => {
      other = some('b');
      result = option.xor(other);

      expect(result).toBe(other);
    });

    test('should return new None if other option is None', () => {
      other = none();
      result = option.xor(other);

      expect(result.isNone()).toBe(true);
      expect(result).not.toBe(option);
      expect(result).not.toBe(other);
    });
  });

  describe('zip()', () => {
    let other: Option<string>;
    let result: Option<[string, string]>;

    test('should always return None', () => {
      other = none();
      result = option.zip(other);

      expect(result.isNone()).toBe(true);
    });
  });
});

describe('Some', () => {
  let option: Option<string>;

  beforeEach(() => {
    option = some('a');
  });

  describe('and()', () => {
    let other: Option<boolean>;
    let result: Option<boolean>;

    test('should always return the other option', () => {
      other = some(true);

      result = option.and(other);

      expect(result).toBe(other);
    });
  });

  describe('andThen()', () => {
    let fn: Compute<string, Option<boolean>>;
    let result: Option<boolean>;

    test('should always return the mapped option', () => {
      fn = v => some(v === 'a');
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
    const other = some('b');
    let result: Option<string>;

    test('should always return self', () => {
      result = option.or(other);

      expect(result).toBe(option);
    });
  });

  describe('orElse()', () => {
    const other = () => some('b');
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
      other = none();
      result = option.xor(other);

      expect(result).toBe(option);
    });

    test('should always return None if both are Some', () => {
      other = some('b');
      result = option.xor(other);

      expect(result.isNone()).toBe(true);
    });
  });

  describe('zip()', () => {
    let other: Option<string>;
    let result: Option<[string, string]>;

    test('should return zipped Some if both are Some', () => {
      other = some('b');
      result = option.zip(other);

      expect(result.isSome()).toBe(true);
      expect(result.unwrap()).toEqual(['a', 'b']);
    });

    test('should return None if other is None', () => {
      other = none();
      result = option.zip(other);

      expect(result.isNone()).toBe(true);
    });
  });
});

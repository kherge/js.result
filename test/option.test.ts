import { None, Option, Some } from '../src/option';
import { Result } from '../src/result';
import { Map, Predicate } from '../src/shared';

describe('Option', () => {
  describe('and()', () => {
    let option: Option<string>;
    let other: Option<boolean>;
    let result: Option<boolean>;

    test('should return other if both are Some', () => {
      option = new Some('a');
      other = new Some(true);

      result = option.and(other);

      expect(result).toBe(other);
    });

    test('should return None if option is None', () => {
      option = new None();
      other = new Some(true);

      result = option.and(other);

      expect(result.isNone()).toBe(true);
    });

    test('should return None if other is None', () => {
      option = new Some('a');
      other = new None();

      result = option.and(other);

      expect(result.isNone()).toBe(true);
    });
  });

  describe('andThen()', () => {
    let fn: Map<string, Option<boolean>>;
    let option: Option<string>;
    let result: Option<boolean>;

    test('should invoke and return Some if option is Some', () => {
      fn = v => new Some(v === 'a');
      option = new Some('a');

      result = option.andThen(fn);

      expect(result.isSome()).toBe(true);
      expect(result.unwrap()).toBe(true);
    });

    test('should not invoke and return None if option is None', () => {
      fn = jest.fn();
      option = new None();

      result = option.andThen(fn);

      expect(result.isNone()).toBe(true);
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe('filter()', () => {
    let option: Option<string>;
    let predicate: Predicate<string>;
    let result: Option<string>;

    test('should return Some if option is Some and match', () => {
      option = new Some('a');
      predicate = v => v === 'a';

      result = option.filter(predicate);

      expect(result.isSome()).toBe(true);
      expect(result.unwrap()).toEqual('a');
    });

    test('should return None if option is Some and not match', () => {
      option = new Some('a');
      predicate = v => v !== 'a';

      result = option.filter(predicate);

      expect(result.isNone()).toBe(true);
    });

    test('should return None if option is None', () => {
      option = new None();
      predicate = v => v === 'a';

      result = option.filter(predicate);

      expect(result.isNone()).toBe(true);
    });
  });

  describe('isNone()', () => {
    let option: Option<string>;

    test('should return false if option is Some', () => {
      option = new Some('a');

      expect(option.isNone()).toBe(false);
    });

    test('should return true if option is None', () => {
      option = new None();

      expect(option.isNone()).toBe(true);
    });
  });

  describe('map()', () => {
    let fn: Map<string, number>;
    let option: Option<string>;
    let result: Option<number>;

    test('should map value if option is Some', () => {
      fn = v => v.length;
      option = new Some('abc');

      result = option.map(fn);

      expect(result.isSome()).toBe(true);
      expect(result.unwrap()).toEqual(3);
    });

    test('should not map value if option is None', () => {
      fn = jest.fn();
      option = new None();

      result = option.map(fn);

      expect(result.isNone()).toBe(true);
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe('mapOr()', () => {
    const def = 123;
    let fn: Map<string, number>;
    let option: Option<string>;
    let result: number;

    test('should return default if option is None', () => {
      fn = jest.fn();
      option = new None();

      result = option.mapOr(def, fn);

      expect(result).toEqual(def);
      expect(fn).not.toHaveBeenCalled();
    });

    test('should map value if option is Some', () => {
      fn = v => v.length;
      option = new Some('a');

      result = option.mapOr(def, fn);

      expect(result).toEqual(1);
    });
  });

  describe('mapOrElse()', () => {
    const def = () => 123;
    let fn: Map<string, number>;
    let option: Option<string>;
    let result: number;

    test('should compute and return default if option is None', () => {
      fn = jest.fn();
      option = new None();

      result = option.mapOrElse(def, fn);

      expect(result).toEqual(123);
      expect(fn).not.toHaveBeenCalled();
    });

    test('should map value if option is Some', () => {
      fn = v => v.length;
      option = new Some('a');

      result = option.mapOrElse(def, fn);

      expect(result).toEqual(1);
    });
  });

  describe('okOr()', () => {
    const error = 'test';
    let option: Option<string>;
    let result: Result<string, string>;

    test('should return Ok if Some', () => {
      option = new Some('a');

      result = option.okOr(error);

      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toEqual('a');
    });

    test('should return Err if None', () => {
      option = new None();

      result = option.okOr(error);

      expect(result.isErr()).toBe(true);
      expect(result.error().isSome()).toBe(true);
      expect(result.error().unwrap()).toEqual(error);
    });
  });

  describe('okOrElse()', () => {
    const error = () => 'test';
    let option: Option<string>;
    let result: Result<string, string>;

    test('should return Ok if Some', () => {
      option = new Some('a');

      result = option.okOrElse(error);

      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toEqual('a');
    });

    test('should compute and return Err if None', () => {
      option = new None();

      result = option.okOrElse(error);

      expect(result.isErr()).toBe(true);
      expect(result.error().isSome()).toBe(true);
      expect(result.error().unwrap()).toEqual(error());
    });
  });

  describe('or()', () => {
    let option: Option<string>;
    const other = new Some('b');
    let result: Option<string>;

    test('should return self if option is Some', () => {
      option = new Some('a');

      result = option.or(other);

      expect(result).toBe(option);
    });

    test('should return other if option is None', () => {
      option = new None();

      result = option.or(other);

      expect(result).toBe(other);
    });
  });

  describe('orElse()', () => {
    let option: Option<string>;
    const other = () => new Some('b');
    let result: Option<string>;

    test('should return self if option is Some', () => {
      option = new Some('a');

      result = option.orElse(other);

      expect(result).toBe(option);
    });

    test('should compute and return other if option is None', () => {
      option = new None();

      result = option.orElse(other);

      expect(result.isSome()).toBe(true);
      expect(result.unwrap()).toEqual('b');
    });
  });

  describe('unwrapOr()', () => {
    const def = 'b';
    let option: Option<string>;
    let result: string;

    test('should return value if Some', () => {
      option = new Some('a');

      result = option.unwrapOr(def);

      expect(result).toEqual('a');
    });

    test('should return default value if None', () => {
      option = new None();

      result = option.unwrapOr(def);

      expect(result).toEqual(def);
    });
  });

  describe('unwrapOrElse()', () => {
    const def = () => 'b';
    let option: Option<string>;
    let result: string;

    test('should return value if Some', () => {
      option = new Some('a');

      result = option.unwrapOrElse(def);

      expect(result).toEqual('a');
    });

    test('should compute and return default value if None', () => {
      option = new None();

      result = option.unwrapOrElse(def);

      expect(result).toEqual(def());
    });
  });

  describe('xor()', () => {
    let option: Option<string>;
    let other: Option<string>;
    let result: Option<string>;

    test('should return self if Some and other is None', () => {
      option = new Some('a');
      other = new None();

      result = option.xor(other);

      expect(result).toBe(option);
    });

    test('should return other if None and other is Some', () => {
      option = new None();
      other = new Some('b');

      result = option.xor(other);

      expect(result).toBe(other);
    });

    test('should return None if both are Some', () => {
      option = new Some('a');
      other = new Some('b');

      result = option.xor(other);

      expect(result.isNone()).toBe(true);
    });
  });

  describe('zip()', () => {
    let option: Option<string>;
    let other: Option<string>;
    let result: Option<[string, string]>;

    test('should return zipped Some if both Some', () => {
      option = new Some('a');
      other = new Some('b');

      result = option.zip(other);

      expect(result.isSome()).toBe(true);
      expect(result.unwrap()).toEqual(['a', 'b']);
    });

    test('should return None if either is None', () => {
      option = new Some('a');
      other = new None();

      result = option.zip(other);

      expect(result.isNone()).toBe(true);

      option = new None();
      other = new Some('b');

      expect(result.isNone()).toBe(true);
    });
  });
});

describe('None', () => {
  const option: Option<string> = new None();

  test('isSome() should always be false', () => {
    expect(option.isSome()).toBe(false);
  });

  test('replace() should always throw', () => {
    expect(() => option.replace('a')).toThrow('Not a Some option.');
  });

  test('unwrap() should always throw', () => {
    expect(() => option.unwrap()).toThrow('No value to unwrap.');
  });
});

describe('Some', () => {
  let option: Option<string>;

  beforeEach(() => {
    option = new Some('a');
  });

  test('isSome() should always be true', () => {
    expect(option.isSome()).toBe(true);
  });

  test('replace() should always replace', () => {
    const old: Option<string> = option.replace('b');

    expect(old.unwrap()).toBe('a');
    expect(option.unwrap()).toBe('b');
  });

  test('unwrap() should always unwrap', () => {
    expect(option.unwrap()).toEqual('a');
  });
});

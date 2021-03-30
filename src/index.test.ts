import type { Compute, Option, Predicate, Produce, Result } from '../src';

import { err, none, ok, some } from '../src';

describe('The index', () => {
  describe('should re-export the shared type', () => {
    test('Compute', () => {
      const compute: Compute<string, number> = s => s.length;
  
      expect(compute('test')).toEqual(4);
    });

    test('Predicate', () => {
      const predicate: Predicate<string> = s => s === 'test';
  
      expect(predicate('test')).toBe(true);
    });

    test('Produce', () => {
      const produce: Produce<string> = () => 'test';
  
      expect(produce()).toEqual('test');
    });
  });

  describe('should re-export the Option', () => {
    let value: Option<string>;

    test('interface', () => {
      // should be caught already by tsc
    });

    test('none()', () => {
      value = none();

      expect(value.isNone()).toBe(true);
    });

    test('some()', () => {
      value = some('test');

      expect(value.isSome()).toBe(true);
    });
  });

  describe('should re-export the Result', () => {
    let result: Result<string, number>;

    test('interface', () => {
      // should be caught already by tsc
    });

    test('err()', () => {
      result = err(123);

      expect(result.isErr()).toBe(true);
    });

    test('ok()', () => {
      result = ok('test');

      expect(result.isOk()).toBe(true);
    });
  });
});

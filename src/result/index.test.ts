import { Result, attempt, err, ok } from '.';

type TestError = {
  error: string;
};

type TestValue = {
  value: string;
};

describe('The Result export', () => {
  describe('attempt', () => {
    const throws = (a: number, b: string): string => {
      const c = a - 10;

      if (c < 0) {
        throw new Error('The result is negative.');
      }

      return `${b}: ${a} - 10 = ${c}`;
    };

    test('should create a properly typed Err', () => {
      const result = attempt(() => throws(1, 'test'));

      expect(result.isErr()).toBe(true);
    });

    test('should create a properly typed Ok', () => {
      const result = attempt(() => throws(11, 'test'));

      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toEqual('test: 11 - 10 = 1');
    });
  });

  describe('err', () => {
    test('should create a properly typed Err', () => {
      const error: TestError = { error: 'error' };
      const result: Result<TestValue, TestError> = err(error);

      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBe(error);
    });
  });

  describe('ok', () => {
    test('should create a properly typed Ok', () => {
      const value: TestValue = { value: 'value' };
      const result: Result<TestValue, TestError> = ok(value);

      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe(value);
    });
  });
});

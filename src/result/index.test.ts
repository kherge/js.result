import { Result, err, ok } from '.';

type TestError = {
  error: string;
};

type TestValue = {
  value: string;
};

describe('The Result export', () => {
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

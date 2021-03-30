import { Option, Result, err, none, ok, some } from '../src';

type TestError = {
  error: string;
};

type TestValue = {
  value: string;
};

describe('The index', () => {
  test('should re-export Option', () => {
    let option: Option<TestValue>;
    const value: TestValue = { value: 'value' };

    option = none();

    expect(option.isNone()).toBe(true);

    option = some(value);

    expect(option.isSome()).toBe(true);
    expect(option.unwrap()).toBe(value);
  });

  test('should re-export Result', () => {
    const error: TestError = { error: 'error' };
    let result: Result<TestValue, TestError>;
    const value: TestValue = { value: 'value' };

    result = err(error);

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBe(error);

    result = ok(value);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(value);
  });
});

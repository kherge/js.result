import { Option, Result, err, none, ok, some } from '../src';

describe('The index', () => {
  test('should re-export Option', () => {
    let option: Option<boolean>;

    option = none();
    option = some(true);

    expect(option).not.toBeUndefined();
  });

  test('should re-export Result', () => {
    let result: Result<string, number>;

    result = err(123);
    result = ok('test');

    expect(result).not.toBeUndefined();
  });
});

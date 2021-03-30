import { none, some } from '.';

type TestValue = {
  value: string;
};

describe('The Option export', () => {
  const value: TestValue = { value: 'value' };

  describe('none', () => {
    test('should create a properly typed None', () => {
      const option = none<TestValue>();

      expect(option.isNone()).toBe(true);
    });
  });

  describe('some', () => {
    test('should create a property typed Some', () => {
      const option = some<TestValue>(value);

      expect(option.isSome()).toBe(true);
      expect(option.unwrap()).toBe(value);
    });
  });
});

import { maybe, none, some } from '.';

type TestValue = {
  value: string;
};

describe('The Option export', () => {
  const value: TestValue = { value: 'value' };

  describe('maybe', () => {
    test.each([null, undefined])(
      'should create a properly typed None (%s)',
      actual => {
        const option = maybe(actual);

        expect(option.isNone());
      }
    );

    test('should create a property typed Some', () => {
      const option = maybe(value);

      expect(option.isSome());
      expect(option.unwrap()).toBe(value);
    });
  });

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

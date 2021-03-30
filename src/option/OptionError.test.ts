import OptionError from './OptionError';

describe('OptionError', () => {
  const message: string = 'error';
  const error = new OptionError(message);

  test('should use correct error name', () => {
    expect(error.toString()).toEqual('OptionError: error');
  });

  describe('on instantiation', () => {
    test('should set the error message', () => {
      expect(error.message).toEqual(message);
    });

    test('should set the prototype', () => {
      expect(Object.getPrototypeOf(error)).toBe(OptionError.prototype);
    });
  });
});

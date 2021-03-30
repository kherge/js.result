import ResultError from './ResultError';

describe('ResultError', () => {
  const message: string = 'error';
  const error = new ResultError(message);

  test('should use correct error name', () => {
    expect(error.toString()).toEqual('ResultError: error');
  });

  describe('on instantiation', () => {
    test('should set the error message', () => {
      expect(error.message).toEqual(message);
    });

    test('should set the prototype', () => {
      expect(Object.getPrototypeOf(error)).toBe(ResultError.prototype);
    });
  });
});

const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

describe('Unit Tests for Utilities', () => {
  test('AppError sets message and status code correctly', () => {
    const error = new AppError('Custom Error', 400);
    expect(error.message).toBe('Custom Error');
    expect(error.statusCode).toBe(400);
  });

  test('asyncHandler executes provided function', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    const handler = asyncHandler(fn);
    const req = {}, res = {}, next = jest.fn();
    await handler(req, res, next);
    expect(fn).toHaveBeenCalledWith(req, res, next);
  });
});
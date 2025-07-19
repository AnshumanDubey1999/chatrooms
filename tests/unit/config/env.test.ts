import { getValue } from '../../../src/config/env';

describe('getValue Function', () => {
  const originalProcessExit = process.exit;
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
    process.exit = jest.fn() as unknown as typeof process.exit;
  });

  afterEach(() => {
    console.error = originalConsoleError;
    process.exit = originalProcessExit;
  });

  test('should return the value of an existing environment variable', () => {
    process.env.TEST_KEY = 'test_value';
    const result = getValue('TEST_KEY');
    expect(result).toBe('test_value');
  });

  test('should log an error and exit if the environment variable is not defined', () => {
    delete process.env.UNDEFINED_KEY;
    getValue('UNDEFINED_KEY');
    expect(console.error).toHaveBeenCalledWith(
      'Value for environment variable UNDEFINED_KEY is not defined!'
    );
    expect(process.exit).toHaveBeenCalledWith(0);
  });
});

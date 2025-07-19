import { AppError } from '../../../src/exceptions/AppError';
import { Errors } from '../../../src/exceptions/Errors';

describe('AppError', () => {
  test('should create an instance of AppError with correct properties', () => {
    const error = new AppError(Errors.ROOM_NOT_FOUND);
    expect(error.code).toBe('EX.CR.001');
    expect(error.message).toBe('The requested room was not found.');
    expect(error.statusCode).toBe(404);
  });

  test('should create an instance of AppError with default status code 400 when status code is not present', () => {
    const error = new AppError(Errors.INVALID_ROOM_TYPE);
    expect(error.statusCode).toBe(400);
  });

  test('should handle sendResponse', () => {
    const error = new AppError(Errors.ROOM_NOT_FOUND);
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    error.sendResponse(mockResponse as any);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        code: 'EX.CR.001',
        message: 'The requested room was not found.',
        field: 'roomId',
      },
    });
  });
});

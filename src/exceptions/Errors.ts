export enum Errors {
    ROOM_NOT_FOUND = 'ROOM_NOT_FOUND',
    INVALID_ROOM_TYPE = 'INVALID_ROOM_TYPE',
    USER_LIMIT_EXCEEDED = 'USER_LIMIT_EXCEEDED',
    ROOM_LIMIT_EXCEEDED = 'ROOM_LIMIT_EXCEEDED',
    ROOM_ALREADY_EXISTS = 'ROOM_ALREADY_EXISTS',
    USER_NOT_IN_ROOM = 'USER_NOT_IN_ROOM',
    NO_TOKEN_PROVIDED = 'NO_TOKEN_PROVIDED',
    INVALID_TOKEN = 'INVALID_TOKEN',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    GLOBAL_USER_LIMIT_EXCEEDED = 'GLOBAL_USER_LIMIT_EXCEEDED',
    GLOBAL_MESSAGE_LIMIT_EXCEEDED = 'GLOBAL_MESSAGE_LIMIT_EXCEEDED',
}

export const ErrorData: Record<Errors, { code: string; message: string; field?: string, statusCode?: number }> = {
    [Errors.ROOM_NOT_FOUND]: {
      code: 'EX.CR.001',
      message: 'The requested room was not found.',
      field: 'roomId',
      statusCode: 404
    },
    [Errors.INVALID_ROOM_TYPE]: {
      code: 'EX.CR.002',
      message: 'The provided room type is invalid.',
      field: 'type',
    },
    [Errors.USER_LIMIT_EXCEEDED]: {
      code: 'EX.CR.003',
      message: 'The user limit for this room has been exceeded.'
    },
    [Errors.ROOM_LIMIT_EXCEEDED]: {
        code: 'EX.CR.004',
        message: 'No more room creations are allowed at this time.',
        statusCode: 503
    },
    [Errors.ROOM_ALREADY_EXISTS]: {
        code: 'EX.CR.005',
        message: 'Room with given id already exists.',
        field: 'roomId'
    },
    [Errors.USER_NOT_IN_ROOM]: {
        code: 'EX.CR.006',
        message: 'User is not part of room.',
        field: 'roomId'
    },
    [Errors.NO_TOKEN_PROVIDED]: {
        code: 'EX.CR.007',
        message: 'No Token was provided in request',
        statusCode: 401
    },
    [Errors.INVALID_TOKEN]: {
        code: 'EX.CR.008',
        message: 'The token provided is invalid.',
        statusCode: 401
    },
    [Errors.USER_NOT_FOUND]: {
        code: 'EX.CR.009',
        message: 'The User present in token was not found.',
        statusCode: 404
    },
    [Errors.GLOBAL_USER_LIMIT_EXCEEDED]: {
        code: 'EX.CR.010',
        message: 'No more user creations are allowed at this time.',
        statusCode: 503
    },
    [Errors.GLOBAL_MESSAGE_LIMIT_EXCEEDED]: {
        code: 'EX.CR.011',
        message: 'No more messages can be sent at this time.',
        statusCode: 503
    },
};

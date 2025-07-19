export enum ROOM_TYPES {
  TTT = 'TTT',
}

export const ROOM_LIMIT = 10;
export const USER_LIMIT = 100;
export const MESSAGE_LIMIT_PER_ROOM = 100;

export const USER_LIMIT_PER_ROOM = {
  [ROOM_TYPES.TTT]: 2,
};

export const ROOM_EXPIRES_IN_SECONDS = 3 * 60 * 60;
export const USER_EXPIRES_IN_SECONDS = 3 * 60 * 60;
export const MESSAGES_EXPIRES_IN_SECONDS = 30 * 60;
export const TOKEN_EXPIRES_IN = '3h';

export const MAX_USERNAME_LENGTH = 30;
export const MAX_ROOM_ID_LENGTH = 10;
export const MAX_MESSAGES_IN_BUFFER = 1000;

import {
  MAX_ROOM_ID_LENGTH,
  MAX_USERNAME_LENGTH,
  ROOM_TYPES,
} from '../config/constants.js';
import { validate, Joi } from 'express-validation';

const validRoomTypes = Object.values(ROOM_TYPES);

const register = {
  body: Joi.object({
    name: Joi.string().max(MAX_USERNAME_LENGTH).required(),
  }),
};

const createRoom = {
  body: Joi.object({
    roomId: Joi.string().max(MAX_ROOM_ID_LENGTH),
    roomType: Joi.string()
      .valid(...validRoomTypes)
      .required(),
  }),
};

export const registerValidation = validate(register, {}, {});
export const createRoomValidation = validate(createRoom, {}, {});

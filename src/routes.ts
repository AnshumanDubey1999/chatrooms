import { Express, Request, Response } from 'express';
import { createToken, validateToken } from './services/authService';
import { createRoom } from './services/roomService';
import { createUser } from './services/userService';
import {
  createRoomValidation,
  registerValidation,
} from './validations/routeValidations';

export const setupRoutes = (app: Express): void => {
  app.post(
    '/register',
    registerValidation,
    async (req: Request, res: Response) => {
      const { name } = req.body;
      const user = await createUser(name);
      const token = createToken(user._id);
      res.status(201).json({
        token,
        user,
      });
    }
  );

  app.post(
    '/rooms',
    createRoomValidation,
    async (req: Request, res: Response) => {
      const user = await validateToken(req.headers.authorization);
      const { roomId, roomType } = req.body;
      const room = await createRoom(roomId, roomType, user._id);
      res.status(201).json({
        roomId: room.id,
      });
    }
  );
};

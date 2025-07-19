import jwt from 'jsonwebtoken';
import { AppError } from '../exceptions/AppError';
import { Errors } from '../exceptions/Errors';
import { getUser } from './userService';
import { JWT_SECRET } from '../config/env';
import { ObjectId } from 'mongoose';
import { TOKEN_EXPIRES_IN } from '../config/constants';

export async function validateToken(token?: string) {
  try {
    if (!token || !token.startsWith('Bearer ')) {
      throw new AppError(Errors.NO_TOKEN_PROVIDED);
    }

    token = token.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    console.log('decoded', decoded);
    if (!decoded || !decoded.userId) {
      throw new AppError(Errors.INVALID_TOKEN);
    }

    return await getUser(decoded.userId);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(Errors.INVALID_TOKEN);
  }
}

export function createToken(userId: ObjectId): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
}

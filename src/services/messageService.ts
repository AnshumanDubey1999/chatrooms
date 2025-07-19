import { ObjectId } from 'mongoose';
import { Message, MessageType } from '../models/messages.js';
import { getRoom } from './roomService.js';
import { getUser } from './userService.js';
import {
  MAX_MESSAGES_IN_BUFFER,
  MESSAGE_LIMIT_PER_ROOM,
} from '../config/constants.js';
import { AppError } from '../exceptions/AppError.js';
import { Errors } from '../exceptions/Errors.js';

const roomMessagesMap: Map<string, MessageType[]> = new Map();
const messagesToSave: MessageType[] = [];
const messagesToDelete: ObjectId[] = [];

export const addMessage = async (
  userId: ObjectId,
  roomId: string,
  message: string
) => {
  if (
    messagesToSave.length > MAX_MESSAGES_IN_BUFFER ||
    messagesToDelete.length > MAX_MESSAGES_IN_BUFFER
  ) {
    throw new AppError(Errors.GLOBAL_MESSAGE_LIMIT_EXCEEDED);
  }

  getRoom(roomId);
  getUser(String(userId));

  const newMessage = new Message({
    roomId,
    message,
    from: userId,
  });

  messagesToSave.push(newMessage);
  const messages = roomMessagesMap.get(roomId);
  if (messages) {
    if (messages.length >= MESSAGE_LIMIT_PER_ROOM) {
      messagesToDelete.push(messages[0]._id);
    }
    messages.push(newMessage);
  } else {
    roomMessagesMap.set(roomId, [newMessage]);
  }

  return newMessage;
};

export const removeRoomMessages = async (roomId: string) => {
  const messages = roomMessagesMap.get(roomId);

  if (!messages) return;

  roomMessagesMap.delete(roomId);
  Message.deleteMany({ room: roomId });
};

export const updateNewMessages = async () => {
  if (messagesToSave.length === 0) return;

  await Message.insertMany(messagesToSave);
  messagesToSave.length = 0;
};

export const updateRemovedMessages = async () => {
  if (messagesToDelete.length === 0) return;

  await Message.deleteMany({ _id: { $in: messagesToDelete } });
  messagesToDelete.length = 0;
};

import { ObjectId } from 'mongoose';
import { AppError } from '../exceptions/AppError.js';
import { Errors } from '../exceptions/Errors.js';
import { User, UserType } from '../models/user.js';
import { USER_LIMIT } from '../config/constants.js';

const users: Map<string, UserType> = new Map();

export const initializeUsers = async () => {
  const availableUsers = await User.find();

  for (const user of availableUsers) {
    users.set(String(user._id), user);
  }

  console.log('Users initialized from the database.');
};

export const getUser = async (id: string) => {
  console.log('Id', id);
  console.log('Users', users);
  const user = users.get(id);
  if (!user) throw new AppError(Errors.USER_NOT_FOUND);

  return user;
};

export const createUser = async (name: string) => {
  if (users.size >= USER_LIMIT) {
    throw new AppError(Errors.GLOBAL_USER_LIMIT_EXCEEDED);
  }

  const newUser = await User.create({ name });

  users.set(String(newUser._id), newUser);
  console.log('Users', users);
  return newUser;
};

export const removeUsers = async (userIds: ObjectId[]) => {
  for (const userId of userIds) users.delete(String(userId));

  await User.deleteMany({ _id: { $in: userIds } });
};

export const removeUser = async (userId: ObjectId) => {
  const id = String(userId);
  if (!users.has(id)) return;

  users.delete(id);
  await User.deleteOne({ _id: userId });
};

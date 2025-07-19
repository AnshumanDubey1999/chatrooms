import mongoose, { Schema } from 'mongoose';
import {
  MAX_USERNAME_LENGTH,
  USER_EXPIRES_IN_SECONDS,
} from '../config/constants.js';

export type UserType = {
  _id: Schema.Types.ObjectId;
  name: string;
  avatar?: string;
};

const UserSchema = new Schema<UserType>(
  {
    name: {
      type: String,
      required: true,
      maxlength: MAX_USERNAME_LENGTH,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: USER_EXPIRES_IN_SECONDS }
);

export const User = mongoose.model<UserType>('users', UserSchema);

import mongoose, { Schema } from 'mongoose';
import {
  MAX_ROOM_ID_LENGTH,
  ROOM_EXPIRES_IN_SECONDS,
  ROOM_TYPES,
} from '../config/constants.js';

export type RoomType = {
  _id: string;
  owner: Schema.Types.ObjectId;
  type: ROOM_TYPES;
  maxSize: number;
  users: Schema.Types.ObjectId[];
  state?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const RoomSchema = new Schema<RoomType>(
  {
    _id: {
      type: String,
      required: true,
      maxlength: MAX_ROOM_ID_LENGTH,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ROOM_TYPES,
    },
    maxSize: {
      type: Number,
      required: true,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
    ],
    state: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

RoomSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: ROOM_EXPIRES_IN_SECONDS }
);

export const Room = mongoose.model<RoomType>('rooms', RoomSchema);

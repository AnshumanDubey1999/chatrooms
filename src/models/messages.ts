import mongoose, { Schema } from 'mongoose';
import { MESSAGES_EXPIRES_IN_SECONDS } from '../config/constants';

export type MessageType = {
  _id: Schema.Types.ObjectId;
  roomId: string;
  from: Schema.Types.ObjectId;
  message: string;
};

const MessageSchema = new Schema<MessageType>(
  {
    roomId: {
      type: String,
      required: true,
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 255,
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: MESSAGES_EXPIRES_IN_SECONDS }
);

export const Message = mongoose.model<MessageType>('messages', MessageSchema);

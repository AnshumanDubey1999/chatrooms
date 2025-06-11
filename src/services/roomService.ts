import { Room, RoomType } from '../models/room.js';
import { AppError } from '../exceptions/AppError.js';
import { Errors } from '../exceptions/Errors.js';
import { ObjectId } from 'mongoose';
import { ROOM_EXPIRES_IN_SECONDS, ROOM_LIMIT, ROOM_TYPES, USER_LIMIT_PER_ROOM } from '../config/constants.js';
import { removeUser, removeUsers } from './userService.js';
import { removeRoomMessages } from './messageService.js';

const rooms: Map<string, RoomType> = new Map();
const roomsToUpdate: Set<string> = new Set();

export const initializeRooms = async () => {
    const availableRooms = await Room.find();

    for (const room of availableRooms) {
        if(!rooms.has(room._id)) rooms.set(room._id, room);
    }

    console.log('Rooms initialized from the database.');
};

export const getRoom = (roomId: string) => {
    const room = rooms.get(roomId)
    if(!room) throw new AppError(Errors.ROOM_NOT_FOUND);

    return room;
}

export const joinRoom = (roomId: string, userId: ObjectId) => {
    const room = getRoom(roomId);

    if(room.users.length >= room.maxSize) throw new AppError(Errors.USER_LIMIT_EXCEEDED);
    
    room.users.push(userId);
    roomsToUpdate.add(roomId);
}

export const createRoom = async (roomId: string, roomType: ROOM_TYPES, userId: ObjectId) => {
    if(rooms.size >= ROOM_LIMIT) throw new AppError(Errors.ROOM_LIMIT_EXCEEDED)

    if (!roomId || roomId == '') roomId = generateRoomId();
    else if(rooms.get(roomId)) throw new AppError(Errors.ROOM_ALREADY_EXISTS)

    const room = await Room.create({
        _id: roomId,
        owner: userId,
        type: roomType,
        maxSize: USER_LIMIT_PER_ROOM[roomType],
        users: [userId]
    });

    rooms.set(roomId, room);
    return room;
}

const generateRoomId = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    if(rooms.get(result)) result = generateRoomId();
    return result;
};

export const leaveRoom = (roomId: string, userId: ObjectId) => {
    const room = getRoom(roomId);

    const userIndex = room.users.indexOf(userId);
    if (userIndex === -1) throw new AppError(Errors.USER_NOT_IN_ROOM);

    room.users.splice(userIndex, 1);

    if(room.users.length == 0) return closeRoom(roomId);

    if(room.owner == userId) room.owner = room.users[0];
    removeUser(userId);
    roomsToUpdate.add(roomId);
}

export const closeRoom = async (roomId: string) => {
    const room = getRoom(roomId);
    await removeUsers(room.users);
    await removeRoomMessages(room._id);
    await Room.deleteOne({ _id: roomId });

    rooms.delete(roomId);
    roomsToUpdate.delete(roomId);
    
    console.log(`Room ${roomId} closed and removed successfully.`);
};

export const closeLongLivedRooms = async () => {
    const closureLine = new Date(Date.now() - ROOM_EXPIRES_IN_SECONDS * 1000)
    for(const room of rooms.values()) {
        if(!room.createdAt) continue;
        if(room.createdAt < closureLine) await closeRoom(room._id);
    }
}

export const updateDataToDatabase = async () => {
    if(roomsToUpdate.size == 0) {
        console.log("Nothing to Update!");
        return;
    }
    try {
      for (const roomId of roomsToUpdate) {
          const room = rooms.get(roomId);
          if(!room) continue;
          await Room.updateOne(
            { _id: roomId },
            {
              $set: {
                owner: room.owner,
                type: room.type,
                maxSize: room.maxSize,
                users: room.users,
                updatedAt: new Date(),
              },
            }
          );
        } 
      console.log('Rooms synced with the database successfully.');
      roomsToUpdate.clear()
    } catch (error) {
      console.error('Error syncing rooms with the database:', error);
    }
};

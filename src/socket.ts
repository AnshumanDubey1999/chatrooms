import { Server } from 'socket.io';
import { getRoom, joinRoom, leaveRoom } from './services/roomService.js';
import { validateToken } from './services/authService.js';
import { addMessage } from './services/messageService.js';

export const setupSocket = (io: Server): void => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token; // Extract token from handshake
      socket.data.user = validateToken(token);
      next()
    } catch (error) {
      console.error('Authentication error:', String(error));
      next(new Error('Authentication failed'));
    }
  });

    io.on('connection', (socket) => {
      const user = socket.data.user;
        socket.on('join-room', (roomId: string): void => {
          const room = getRoom(roomId);
          console.log('Attempting entry in room:', roomId);
          if (room) {
            socket.join(roomId);
            joinRoom(roomId, user._id)
            console.log('User joined:', user.name, user._id);
            socket.to(roomId).emit('user-joined', user.name);
          } else {
            console.log('No Room of id:', roomId);
          }
        });
      
        socket.on(
          'send-message',
          ({
            roomId,
            message,
            username,
          }: {
            roomId: string;
            message: string;
            username: string;
          }): void => {
            const room = getRoom(roomId);
            if (room) {
              const msg = { message, username, timestamp: Date.now() };
              console.log('message: ', msg);
              addMessage(user._id, roomId, message)
              io.to(roomId).emit('receive-message', msg);
            }
          }
        );
      
        socket.on(
          'leave-room',
          ({ roomId, username }: { roomId: string; username: string }): void => {
            leaveRoom(roomId, user._id);

            socket.leave(roomId);
            socket.to(roomId).emit('user-left', username);
          }
        );
      });
};

import { Socket } from 'socket.io';

export default function socketHandler(socket: Socket) {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Add more socket events here
}
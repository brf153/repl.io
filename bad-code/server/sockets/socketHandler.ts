import type { Socket } from "socket.io";

function socketHandler(socket: Socket) {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Add more socket events here
}

export default socketHandler;
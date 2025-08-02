import type { Socket } from "socket.io";

function socketHandler(socket: Socket) {
  try {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

    // Add more socket events here

    socket.on('error', (err) => {
      console.error(`Socket error on ${socket.id}:`, err);
    });
  } catch (err) {
    console.error(`Error in socketHandler for ${socket.id}:`, err);
  }
}

export default socketHandler;
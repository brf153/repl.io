// ...existing code...
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import apiRouter from './routes/api.js';
import socketHandler from './sockets/socketHandler.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
// ...existing code...

// Use Express routes
app.use('/', apiRouter);

// Socket.IO connection
io.on('connection', socketHandler);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
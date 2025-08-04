import express from 'express';
import http from 'http';
import apiRouter from './routes/api.js';
import socketHandler from './sockets/socketHandler.js';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({
    origin: '*', // Should restrict this more in production
    methods: ['GET', 'POST'],
}));

// Use Express routes
app.use('/v1', apiRouter);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Socket.IO connection
socketHandler(server)

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
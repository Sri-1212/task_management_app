import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middleware/error.middleware';
import { initSocket } from './sockets/socket.handler';

const app = express();
const server = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize Socket.IO
initSocket(server, config.clientUrl);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'TaskVerse Server', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Global Error Handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  await connectDB();
  server.listen(config.port, () => {
    console.log(`🚀 TaskVerse anti-gravity server operating on port ${config.port}`);
  });
};

startServer();

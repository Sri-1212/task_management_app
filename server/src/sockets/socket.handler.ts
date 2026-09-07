import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt';

let io: Server;

interface ActivePresence {
  userId: string;
  userName?: string;
  taskId?: string | null;
  typing?: boolean;
  lastSeen: Date;
}

const activeUsers = new Map<string, ActivePresence>();

export const initSocket = (httpServer: HttpServer, clientUrl: string): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true,
    },
  });

  // Socket Auth Middleware
  io.use((socket: Socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      // Allow connection but tag as guest/anonymous for demo if token missing
      (socket as any).userId = 'guest-' + socket.id.substring(0, 5);
      return next();
    }

    try {
      const decoded = verifyAccessToken(token);
      (socket as any).userId = decoded.userId;
      next();
    } catch (err) {
      (socket as any).userId = 'guest-' + socket.id.substring(0, 5);
      next();
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId;
    console.log(`📡 Client connected: ${socket.id} (User: ${userId})`);

    // Track active user presence
    activeUsers.set(socket.id, {
      userId,
      taskId: null,
      typing: false,
      lastSeen: new Date(),
    });

    // Broadcast presence update to all connected clients
    io.emit('user:presence', Array.from(activeUsers.values()));

    // User presence activity update (editing/viewing specific task)
    socket.on('user:activity', (data: { taskId?: string | null; typing?: boolean; userName?: string }) => {
      const current = activeUsers.get(socket.id);
      if (current) {
        activeUsers.set(socket.id, {
          ...current,
          userName: data.userName || current.userName,
          taskId: data.taskId ?? null,
          typing: !!data.typing,
          lastSeen: new Date(),
        });
        io.emit('user:presence', Array.from(activeUsers.values()));
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
      activeUsers.delete(socket.id);
      io.emit('user:presence', Array.from(activeUsers.values()));
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};

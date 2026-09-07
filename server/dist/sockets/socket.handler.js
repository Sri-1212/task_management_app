"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const jwt_1 = require("../utils/jwt");
let io;
const activeUsers = new Map();
const initSocket = (httpServer, clientUrl) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
            methods: ['GET', 'POST', 'PATCH', 'DELETE'],
            credentials: true,
        },
    });
    // Socket Auth Middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.replace('Bearer ', '');
        if (!token) {
            // Allow connection but tag as guest/anonymous for demo if token missing
            socket.userId = 'guest-' + socket.id.substring(0, 5);
            return next();
        }
        try {
            const decoded = (0, jwt_1.verifyAccessToken)(token);
            socket.userId = decoded.userId;
            next();
        }
        catch (err) {
            socket.userId = 'guest-' + socket.id.substring(0, 5);
            next();
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.userId;
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
        socket.on('user:activity', (data) => {
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
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io has not been initialized');
    }
    return io;
};
exports.getIO = getIO;

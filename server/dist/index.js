"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const socket_handler_1 = require("./sockets/socket.handler");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Middleware
app.use((0, cors_1.default)({
    origin: [env_1.config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Initialize Socket.IO
(0, socket_handler_1.initSocket)(server, env_1.config.clientUrl);
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', app: 'TaskVerse Server', timestamp: new Date() });
});
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/tasks', task_routes_1.default);
app.use('/api/users', user_routes_1.default);
// Global Error Handler
app.use(error_middleware_1.errorHandler);
// Start server
const startServer = async () => {
    await (0, db_1.connectDB)();
    server.listen(env_1.config.port, () => {
        console.log(`🚀 TaskVerse anti-gravity server operating on port ${env_1.config.port}`);
    });
};
startServer();

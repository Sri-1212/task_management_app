"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTaskStatus = exports.updateTask = exports.createTask = exports.getTaskById = exports.getTasks = void 0;
const data_service_1 = require("../services/data.service");
const socket_handler_1 = require("../sockets/socket.handler");
const getTasks = async (req, res) => {
    try {
        const userId = req.user.userId;
        const isAdmin = req.user.role === 'admin';
        const tasks = await data_service_1.dataService.getTasks(userId, isAdmin, req.query);
        const formattedTasks = tasks.map((t) => (typeof t.toJSON === 'function' ? t.toJSON() : t));
        return res.json(formattedTasks);
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Failed to fetch tasks' });
    }
};
exports.getTasks = getTasks;
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await data_service_1.dataService.getTaskById(id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        const taskJson = typeof task.toJSON === 'function' ? task.toJSON() : task;
        if (req.user.role !== 'admin' && String(taskJson.owner) !== req.user.userId) {
            return res.status(403).json({ error: 'Not authorized to view this task' });
        }
        return res.json(taskJson);
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Failed to fetch task' });
    }
};
exports.getTaskById = getTaskById;
const createTask = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { title, description, status, priority, dueDate, tags, subtasks, order } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Task title is required' });
        }
        const newTask = await data_service_1.dataService.createTask({ title, description, status, priority, dueDate, tags, subtasks, order }, userId);
        const taskJson = typeof newTask.toJSON === 'function' ? newTask.toJSON() : newTask;
        // Broadcast live event via Socket.IO
        try {
            (0, socket_handler_1.getIO)().emit('task:created', taskJson);
        }
        catch (e) {
            // Socket fail-safe
        }
        return res.status(201).json(taskJson);
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Failed to create task' });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const existingTask = await data_service_1.dataService.getTaskById(id);
        if (!existingTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        const taskOwner = existingTask.owner?.toString() || existingTask.owner;
        if (req.user.role !== 'admin' && taskOwner !== userId) {
            return res.status(403).json({ error: 'Not authorized to update this task' });
        }
        const updated = await data_service_1.dataService.updateTask(id, req.body);
        const taskJson = typeof updated.toJSON === 'function' ? updated.toJSON() : updated;
        try {
            (0, socket_handler_1.getIO)().emit('task:updated', taskJson);
        }
        catch (e) { }
        return res.json(taskJson);
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Failed to update task' });
    }
};
exports.updateTask = updateTask;
const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, order } = req.body;
        const userId = req.user.userId;
        if (!['todo', 'in-progress', 'done'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }
        const existingTask = await data_service_1.dataService.getTaskById(id);
        if (!existingTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        const taskOwner = existingTask.owner?.toString() || existingTask.owner;
        if (req.user.role !== 'admin' && taskOwner !== userId) {
            return res.status(403).json({ error: 'Not authorized to move this task' });
        }
        const updated = await data_service_1.dataService.updateTask(id, { status, order: order ?? 0 });
        const taskJson = typeof updated.toJSON === 'function' ? updated.toJSON() : updated;
        try {
            (0, socket_handler_1.getIO)().emit('task:moved', taskJson);
        }
        catch (e) { }
        return res.json(taskJson);
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Failed to update task status' });
    }
};
exports.updateTaskStatus = updateTaskStatus;
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const existingTask = await data_service_1.dataService.getTaskById(id);
        if (!existingTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        const taskOwner = existingTask.owner?.toString() || existingTask.owner;
        if (req.user.role !== 'admin' && taskOwner !== userId) {
            return res.status(403).json({ error: 'Not authorized to delete this task' });
        }
        await data_service_1.dataService.deleteTask(id);
        try {
            (0, socket_handler_1.getIO)().emit('task:deleted', { id });
        }
        catch (e) { }
        return res.json({ message: 'Task deleted successfully', id });
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Failed to delete task' });
    }
};
exports.deleteTask = deleteTask;

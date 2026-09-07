import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { dataService } from '../services/data.service';
import { getIO } from '../sockets/socket.handler';

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const isAdmin = req.user!.role === 'admin';
    const tasks = await dataService.getTasks(userId, isAdmin, req.query);
    
    const formattedTasks = tasks.map((t) => (typeof t.toJSON === 'function' ? t.toJSON() : t));
    return res.json(formattedTasks);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch tasks' });
  }
};

export const getTaskById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await dataService.getTaskById(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const taskJson = typeof task.toJSON === 'function' ? task.toJSON() : task;
    if (req.user!.role !== 'admin' && String(taskJson.owner) !== req.user!.userId) {
      return res.status(403).json({ error: 'Not authorized to view this task' });
    }

    return res.json(taskJson);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch task' });
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { title, description, status, priority, dueDate, tags, subtasks, order } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const newTask = await dataService.createTask(
      { title, description, status, priority, dueDate, tags, subtasks, order },
      userId
    );

    const taskJson = typeof newTask.toJSON === 'function' ? newTask.toJSON() : newTask;

    // Broadcast live event via Socket.IO
    try {
      getIO().emit('task:created', taskJson);
    } catch (e) {
      // Socket fail-safe
    }

    return res.status(201).json(taskJson);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to create task' });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const existingTask = await dataService.getTaskById(id);

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const taskOwner = (existingTask as any).owner?.toString() || (existingTask as any).owner;
    if (req.user!.role !== 'admin' && taskOwner !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this task' });
    }

    const updated = await dataService.updateTask(id, req.body);
    const taskJson = typeof updated!.toJSON === 'function' ? updated!.toJSON() : updated;

    try {
      getIO().emit('task:updated', taskJson);
    } catch (e) {}

    return res.json(taskJson);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to update task' });
  }
};

export const updateTaskStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, order } = req.body;
    const userId = req.user!.userId;

    if (!['todo', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const existingTask = await dataService.getTaskById(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const taskOwner = (existingTask as any).owner?.toString() || (existingTask as any).owner;
    if (req.user!.role !== 'admin' && taskOwner !== userId) {
      return res.status(403).json({ error: 'Not authorized to move this task' });
    }

    const updated = await dataService.updateTask(id, { status, order: order ?? 0 });
    const taskJson = typeof updated!.toJSON === 'function' ? updated!.toJSON() : updated;

    try {
      getIO().emit('task:moved', taskJson);
    } catch (e) {}

    return res.json(taskJson);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to update task status' });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const existingTask = await dataService.getTaskById(id);

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const taskOwner = (existingTask as any).owner?.toString() || (existingTask as any).owner;
    if (req.user!.role !== 'admin' && taskOwner !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this task' });
    }

    await dataService.deleteTask(id);

    try {
      getIO().emit('task:deleted', { id });
    } catch (e) {}

    return res.json({ message: 'Task deleted successfully', id });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to delete task' });
  }
};

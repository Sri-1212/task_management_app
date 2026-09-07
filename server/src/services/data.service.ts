import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User, IUser } from '../models/User';
import { Task, ITask } from '../models/Task';
import { isUsingMongo } from '../config/db';

// Memory storage fallback structure
interface MemoryUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  avatar?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface MemoryTask {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date | null;
  tags: string[];
  subtasks: { id: string; title: string; completed: boolean }[];
  owner: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const memoryUsers: MemoryUser[] = [];
const memoryTasks: MemoryTask[] = [];

// Seed initial default demo user & tasks if in memory mode
const seedMemoryData = async () => {
  if (memoryUsers.length === 0) {
    const demoPasswordHash = await bcrypt.hash('TaskVerse2026!', 10);
    const demoUserId = '65f1a2b3c4d5e6f7a8b9c0d1';
    
    memoryUsers.push({
      id: demoUserId,
      name: 'Commander Nova',
      email: 'demo@taskverse.io',
      passwordHash: demoPasswordHash,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    memoryTasks.push(
      {
        id: 'task-1',
        title: 'Calibrate Anti-Gravity Engine',
        description: 'Ensure thrust vectoring is balanced at 98.4% efficiency for orbital entry.',
        status: 'todo',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000 * 2),
        tags: ['Engineering', 'Physics'],
        subtasks: [
          { id: 'st-1', title: 'Check quantum coils', completed: true },
          { id: 'st-2', title: 'Verify plasma flow', completed: false }
        ],
        owner: demoUserId,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'task-2',
        title: 'Synthesize Tachyon Shield Array',
        description: 'Deploy solar flare deflector shield over sector 7.',
        status: 'in-progress',
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000 * 4),
        tags: ['Security', 'Shields'],
        subtasks: [
          { id: 'st-3', title: 'Align harmonic frequencies', completed: true }
        ],
        owner: demoUserId,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'task-3',
        title: 'Initialize Zero-G Command Interface',
        description: 'Complete holographic board UI integration with live Socket.IO feeds.',
        status: 'done',
        priority: 'high',
        dueDate: new Date(Date.now() - 86400000),
        tags: ['UI/UX', 'Core'],
        subtasks: [
          { id: 'st-4', title: 'Test 3D glass tilt', completed: true },
          { id: 'st-5', title: 'Verify particle bursts', completed: true }
        ],
        owner: demoUserId,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );
  }
};

seedMemoryData();

export const dataService = {
  // USER OPERATIONS
  async findUserByEmail(email: string) {
    if (isUsingMongo) {
      return User.findOne({ email: email.toLowerCase() });
    }
    const found = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return null;
    return {
      ...found,
      _id: found.id,
      toJSON: () => ({
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        avatar: found.avatar,
        createdAt: found.createdAt,
        updatedAt: found.updatedAt,
      }),
    };
  },

  async findUserById(id: string) {
    if (isUsingMongo) {
      return User.findById(id);
    }
    const found = memoryUsers.find((u) => u.id === id);
    if (!found) return null;
    return {
      ...found,
      _id: found.id,
      toJSON: () => ({
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        avatar: found.avatar,
        createdAt: found.createdAt,
        updatedAt: found.updatedAt,
      }),
    };
  },

  async createUser(userData: { name: string; email: string; passwordHash: string; role?: 'user' | 'admin' }) {
    if (isUsingMongo) {
      const newUser = new User({
        name: userData.name,
        email: userData.email.toLowerCase(),
        passwordHash: userData.passwordHash,
        role: userData.role || 'user',
      });
      await newUser.save();
      return newUser;
    }
    const id = new mongoose.Types.ObjectId().toString();
    const newUser: MemoryUser = {
      id,
      name: userData.name,
      email: userData.email.toLowerCase(),
      passwordHash: userData.passwordHash,
      role: userData.role || 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryUsers.push(newUser);
    return {
      ...newUser,
      _id: newUser.id,
      toJSON: () => ({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      }),
    };
  },

  async updateUser(id: string, updates: Partial<MemoryUser>) {
    if (isUsingMongo) {
      return User.findByIdAndUpdate(id, updates, { new: true });
    }
    const userIndex = memoryUsers.findIndex((u) => u.id === id);
    if (userIndex === -1) return null;
    memoryUsers[userIndex] = {
      ...memoryUsers[userIndex],
      ...updates,
      updatedAt: new Date(),
    };
    const updated = memoryUsers[userIndex];
    return {
      ...updated,
      _id: updated.id,
      toJSON: () => ({
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        avatar: updated.avatar,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      }),
    };
  },

  async findUserByResetToken(token: string) {
    if (isUsingMongo) {
      return User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
      });
    }
    const found = memoryUsers.find(
      (u) => u.resetPasswordToken === token && u.resetPasswordExpires && u.resetPasswordExpires > new Date()
    );
    if (!found) return null;
    return {
      ...found,
      _id: found.id,
      save: async () => {},
    };
  },

  // TASK OPERATIONS
  async getTasks(ownerId: string, isAdmin: boolean, query: any) {
    const { status, priority, tag, search, sort } = query;

    if (isUsingMongo) {
      let filter: any = isAdmin ? {} : { owner: ownerId };
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (tag) filter.tags = tag;
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      let sortOptions: any = { createdAt: -1 };
      if (sort === 'dueDate') sortOptions = { dueDate: 1 };
      if (sort === 'priority') sortOptions = { priority: -1 };
      if (sort === 'createdAt') sortOptions = { createdAt: -1 };

      return Task.find(filter).sort(sortOptions);
    }

    let tasks = isAdmin ? [...memoryTasks] : memoryTasks.filter((t) => t.owner === ownerId);

    if (status) tasks = tasks.filter((t) => t.status === status);
    if (priority) tasks = tasks.filter((t) => t.priority === priority);
    if (tag) tasks = tasks.filter((t) => t.tags.includes(tag));
    if (search) {
      const q = search.toLowerCase();
      tasks = tasks.filter(
        (t) => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))
      );
    }

    if (sort === 'dueDate') {
      tasks.sort((a, b) => (new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime()));
    } else if (sort === 'priority') {
      const pMap = { high: 3, medium: 2, low: 1 };
      tasks.sort((a, b) => pMap[b.priority] - pMap[a.priority]);
    } else {
      tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return tasks.map((t) => ({
      ...t,
      _id: t.id,
      toJSON: () => t,
    }));
  },

  async getTaskById(id: string) {
    if (isUsingMongo) {
      return Task.findById(id);
    }
    const found = memoryTasks.find((t) => t.id === id);
    if (!found) return null;
    return {
      ...found,
      _id: found.id,
      toJSON: () => found,
    };
  },

  async createTask(taskData: any, ownerId: string) {
    if (isUsingMongo) {
      const newTask = new Task({
        ...taskData,
        owner: ownerId,
      });
      await newTask.save();
      return newTask;
    }
    const id = 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const newTask: MemoryTask = {
      id,
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      tags: taskData.tags || [],
      subtasks: taskData.subtasks || [],
      owner: ownerId,
      order: taskData.order || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryTasks.push(newTask);
    return {
      ...newTask,
      _id: newTask.id,
      toJSON: () => newTask,
    };
  },

  async updateTask(id: string, updates: any) {
    if (isUsingMongo) {
      return Task.findByIdAndUpdate(id, updates, { new: true });
    }
    const idx = memoryTasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    memoryTasks[idx] = {
      ...memoryTasks[idx],
      ...updates,
      updatedAt: new Date(),
    };
    const updated = memoryTasks[idx];
    return {
      ...updated,
      _id: updated.id,
      toJSON: () => updated,
    };
  },

  async deleteTask(id: string) {
    if (isUsingMongo) {
      return Task.findByIdAndDelete(id);
    }
    const idx = memoryTasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    const deleted = memoryTasks.splice(idx, 1)[0];
    return {
      ...deleted,
      _id: deleted.id,
      toJSON: () => deleted,
    };
  },
};

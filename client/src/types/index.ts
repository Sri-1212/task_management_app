export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type UserRole = 'user' | 'admin';

export interface ISubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface ITask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  tags: string[];
  subtasks: ISubtask[];
  owner: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActiveUserPresence {
  userId: string;
  userName?: string;
  taskId?: string | null;
  typing?: boolean;
  lastSeen: string;
}

export interface TaskFilterOptions {
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  tag?: string;
  search?: string;
  sort?: 'createdAt' | 'dueDate' | 'priority';
}

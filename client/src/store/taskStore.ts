import { create } from 'zustand';
import { ITask, TaskFilterOptions, TaskStatus } from '../types';
import { api } from '../lib/axios';
import { triggerConfetti } from '../lib/utils';

interface TaskState {
  tasks: ITask[];
  isLoading: boolean;
  error: string | null;
  filters: TaskFilterOptions;
  activeTaskModal: ITask | null | 'create';
  
  // Actions
  fetchTasks: () => Promise<void>;
  createTask: (taskData: Partial<ITask>) => Promise<ITask>;
  updateTask: (id: string, taskData: Partial<ITask>) => Promise<ITask>;
  updateTaskStatus: (id: string, status: TaskStatus, order?: number) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilters: (filters: Partial<TaskFilterOptions>) => void;
  openTaskModal: (task: ITask | null | 'create') => void;
  closeTaskModal: () => void;

  // Real-time socket handlers
  onTaskCreated: (task: ITask) => void;
  onTaskUpdated: (task: ITask) => void;
  onTaskDeleted: (payload: { id: string }) => void;
  onTaskMoved: (task: ITask) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    priority: 'all',
    tag: '',
    search: '',
    sort: 'createdAt',
  },
  activeTaskModal: null,

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    get().fetchTasks();
  },

  openTaskModal: (task) => set({ activeTaskModal: task }),
  closeTaskModal: () => set({ activeTaskModal: null }),

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
      if (filters.tag) params.append('tag', filters.tag);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort) params.append('sort', filters.sort);

      const res = await api.get(`/tasks?${params.toString()}`);
      set({ tasks: res.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch tasks', isLoading: false });
    }
  },

  createTask: async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      const newTask = res.data;
      set((state) => ({ tasks: [newTask, ...state.tasks] }));
      return newTask;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to create task');
    }
  },

  updateTask: async (id, taskData) => {
    try {
      const res = await api.patch(`/tasks/${id}`, taskData);
      const updatedTask = res.data;
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
      }));

      if (taskData.status === 'done') {
        triggerConfetti();
      }

      return updatedTask;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to update task');
    }
  },

  updateTaskStatus: async (id, status, order = 0) => {
    // Optimistic UI update
    const prevTasks = get().tasks;
    const taskToUpdate = prevTasks.find((t) => t.id === id);

    if (taskToUpdate && taskToUpdate.status !== status) {
      if (status === 'done') {
        triggerConfetti();
      }
    }

    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, status, order } : t)),
    }));

    try {
      await api.patch(`/tasks/${id}/status`, { status, order });
    } catch (err: any) {
      // Revert on error
      set({ tasks: prevTasks });
      throw new Error(err.response?.data?.error || 'Failed to move task');
    }
  },

  deleteTask: async (id) => {
    const prevTasks = get().tasks;
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    try {
      await api.delete(`/tasks/${id}`);
    } catch (err: any) {
      set({ tasks: prevTasks });
      throw new Error(err.response?.data?.error || 'Failed to delete task');
    }
  },

  // Socket handlers
  onTaskCreated: (task) => {
    set((state) => {
      if (state.tasks.some((t) => t.id === task.id)) return state;
      return { tasks: [task, ...state.tasks] };
    });
  },

  onTaskUpdated: (task) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    }));
  },

  onTaskDeleted: ({ id }) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },

  onTaskMoved: (task) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    }));
  },
}));

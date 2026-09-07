import { create } from 'zustand';
import { ActiveUserPresence } from '../types';
import { connectSocket, getSocket } from '../lib/socket';
import { useTaskStore } from './taskStore';

interface SocketState {
  isConnected: boolean;
  activeUsers: ActiveUserPresence[];
  initializeSocket: () => void;
  emitActivity: (data: { taskId?: string | null; typing?: boolean; userName?: string }) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  isConnected: false,
  activeUsers: [],

  initializeSocket: () => {
    connectSocket();
    const socket = getSocket();

    socket.off('connect');
    socket.off('disconnect');
    socket.off('user:presence');
    socket.off('task:created');
    socket.off('task:updated');
    socket.off('task:deleted');
    socket.off('task:moved');

    socket.on('connect', () => {
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    socket.on('user:presence', (users: ActiveUserPresence[]) => {
      set({ activeUsers: users });
    });

    // Wire live task events directly into task store
    socket.on('task:created', (task) => {
      useTaskStore.getState().onTaskCreated(task);
    });

    socket.on('task:updated', (task) => {
      useTaskStore.getState().onTaskUpdated(task);
    });

    socket.on('task:deleted', (payload) => {
      useTaskStore.getState().onTaskDeleted(payload);
    });

    socket.on('task:moved', (task) => {
      useTaskStore.getState().onTaskMoved(task);
    });
  },

  emitActivity: (data) => {
    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('user:activity', data);
    }
  },
}));

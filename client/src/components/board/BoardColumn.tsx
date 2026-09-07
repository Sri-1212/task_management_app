import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Circle, Clock, CheckCircle, Plus } from 'lucide-react';
import { ITask, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { useTaskStore } from '../../store/taskStore';

interface BoardColumnProps {
  id: TaskStatus;
  title: string;
  tasks: ITask[];
}

export const BoardColumn: React.FC<BoardColumnProps> = ({ id, title, tasks }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const { openTaskModal } = useTaskStore();

  const columnConfig = {
    todo: {
      icon: <Circle className="w-4 h-4 text-violet-400" />,
      gradient: 'from-violet-500/20 to-transparent',
      border: 'border-violet-500/30',
      badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    },
    'in-progress': {
      icon: <Clock className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />,
      gradient: 'from-cyan-500/20 to-transparent',
      border: 'border-cyan-500/30',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    done: {
      icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
      gradient: 'from-emerald-500/20 to-transparent',
      border: 'border-emerald-500/30',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
  };

  const config = columnConfig[id];
  const taskIds = tasks.map((t) => t.id);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full rounded-2xl glass-panel p-4 border transition-all duration-300 ${
        isOver
          ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_30px_rgba(34,211,238,0.3)] scale-[1.01]'
          : config.border
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10">{config.icon}</div>
          <h2 className="font-heading text-lg font-bold text-white tracking-wide">{title}</h2>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${config.badge}`}
          >
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => openTaskModal('create')}
          className="p-1.5 rounded-xl glass-panel text-slate-300 hover:text-white hover:border-cyan-400/40 transition-all"
          title={`Add task to ${title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task List (Sortable Context) */}
      <div className="flex-1 overflow-y-auto min-h-[300px] space-y-3.5 pr-1">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task, idx) => (
            <TaskCard key={task.id} task={task} index={idx} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="h-48 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
            <p className="text-xs font-mono">NO TASKS IN {title.toUpperCase()}</p>
            <button
              onClick={() => openTaskModal('create')}
              className="text-xs text-violet-400 hover:text-cyan-300 transition-colors"
            >
              + Create task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
